"use client";

import { useTranslations } from "next-intl";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useQueryClient } from "@tanstack/react-query";

import { useChatMessages } from "@/hooks/useChatMessages";
import { useChatRoomSocket } from "@/hooks/useChatRoomSocket";
import { useGetOrCreateChatRoom } from "@/hooks/useChatRoom";
import { getChatImageUploadUrl } from "@/lib/api/chat";
import { getApiErrorMessage } from "@/lib/api/getApiErrorMessage";
import { uploadFileToPresignedUrl } from "@/lib/api/profileImage";
import { QUERY_KEYS } from "@/lib/constants/queryKeys";
import {
  CHAT_IMAGE_CONTENT_TYPES,
  CHAT_IMAGE_MAX_SIZE,
  type ChatImageContentType,
  type ChatMessage,
  type ChatRoom,
  type ChatSocketError,
} from "@/types/chat";

interface UseChatRoomModalControllerOptions {
  open: boolean;
  estimateId: number;
}

interface UseConnectedChatRoomModalControllerOptions {
  open: boolean;
  room: ChatRoom | null;
}

export interface RequestEstimateRevisionInput {
  requestedMoveDate: string;
  requestedPrice: number;
  requestedComment: string;
}

function createClientMessageId(): string {
  if (typeof crypto !== "undefined" && "randomUUID" in crypto) {
    return crypto.randomUUID();
  }

  return `${Date.now()}-${Math.random().toString(36).slice(2)}`;
}

function sortMessages(messages: ChatMessage[]): ChatMessage[] {
  return [...messages].sort((a, b) => {
    const createdAtDiff = new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();

    return createdAtDiff === 0 ? a.id - b.id : createdAtDiff;
  });
}

function mergeMessages(messages: ChatMessage[]): ChatMessage[] {
  return sortMessages([...new Map(messages.map((message) => [message.id, message])).values()]);
}

function isChatImageContentType(value: string): value is ChatImageContentType {
  return (CHAT_IMAGE_CONTENT_TYPES as readonly string[]).includes(value);
}

function validateChatImageFile(
  file: File,
  imageTypeError: string,
  imageSizeError: string,
): string | null {
  if (!isChatImageContentType(file.type)) {
    return imageTypeError;
  }

  if (file.size > CHAT_IMAGE_MAX_SIZE) {
    return imageSizeError;
  }

  return null;
}

/**
 * 채팅 모달 진입 시 견적 기준 채팅방을 준비하는 훅
 * // 2026.08.07 김성현 - [추가] 채팅방 생성/조회 로직 분리
 * // 2026.08.08 김성현 - [수정] 생성 실패 메시지를 모달 내 재시도 UI로 전달
 */
export function useChatRoomModalController({
  open,
  estimateId,
}: UseChatRoomModalControllerOptions) {
  const t = useTranslations("chat");
  const [room, setRoom] = useState<ChatRoom | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [createErrorMessage, setCreateErrorMessage] = useState<string | null>(null);
  const requestedEstimateIdRef = useRef<number | null>(null);
  const { mutate: getOrCreateChatRoom, isPending: isChatRoomPending } = useGetOrCreateChatRoom();
  const activeRoom = room?.estimateId === estimateId ? room : null;

  const requestChatRoom = useCallback(() => {
    requestedEstimateIdRef.current = estimateId;
    setToastMessage(null);

    getOrCreateChatRoom(
      { estimateId },
      {
        onSuccess: (nextRoom) => {
          setRoom(nextRoom);
          setCreateErrorMessage(null);
        },
        onError: (error) => {
          setCreateErrorMessage(getApiErrorMessage(error, t("openFailed")));
        },
      },
    );
  }, [estimateId, getOrCreateChatRoom, t]);

  useEffect(() => {
    if (!open) {
      requestedEstimateIdRef.current = null;
      return;
    }

    if (activeRoom || requestedEstimateIdRef.current === estimateId) {
      return;
    }

    requestChatRoom();
  }, [activeRoom, estimateId, open, requestChatRoom]);

  return {
    activeRoom,
    isChatRoomPending,
    createErrorMessage,
    retryCreateChatRoom: requestChatRoom,
    toastMessage,
    clearToastMessage: () => setToastMessage(null),
  };
}

/**
 * 준비된 채팅방의 메시지 조회, 소켓 수신, 전송 상태를 관리하는 훅
 * // 2026.08.07 김성현 - [추가] 채팅 메시지/소켓 로직 분리
 * // 2026.08.18 김성현 - [추가] 채팅 이미지 첨부 업로드/전송 흐름 추가
 * // 2026.08.19 김성현 - [수정] 이미지 선택 후 전송 버튼에서 업로드/전송하도록 변경
 */
export function useConnectedChatRoomModalController({
  open,
  room,
}: UseConnectedChatRoomModalControllerOptions) {
  const t = useTranslations("chat");
  const queryClient = useQueryClient();
  const [messageValue, setMessageValue] = useState("");
  const [selectedImageFile, setSelectedImageFile] = useState<File | null>(null);
  const [selectedImagePreviewUrl, setSelectedImagePreviewUrl] = useState<string | null>(null);
  const [liveMessages, setLiveMessages] = useState<ChatMessage[]>([]);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [isSending, setIsSending] = useState(false);
  const [isImageSending, setIsImageSending] = useState(false);
  const selectedImagePreviewUrlRef = useRef<string | null>(null);
  const roomId = room?.id ?? null;
  const isComposerDisabled = room === null || !room.canSendMessage;

  const messagesQuery = useChatMessages({
    roomId: roomId ?? 0,
    enabled: open && roomId !== null,
  });

  const fetchedMessages = useMemo(
    () => messagesQuery.data?.pages.flatMap((page) => page.data) ?? [],
    [messagesQuery.data],
  );

  const messages = useMemo(
    () => mergeMessages([...fetchedMessages, ...liveMessages]),
    [fetchedMessages, liveMessages],
  );

  const lastMessageId = messages.at(-1)?.id ?? null;

  const appendMessages = useCallback((nextMessages: ChatMessage[]) => {
    setLiveMessages((prevMessages) => mergeMessages([...prevMessages, ...nextMessages]));
  }, []);

  const handleSocketError = useCallback((error: ChatSocketError) => {
    setToastMessage(error.message);
  }, []);

  const {
    isConnected,
    requestEstimateRevision,
    respondEstimateRevision,
    sendImageMessage,
    sendMessage,
  } = useChatRoomSocket({
    roomId: roomId ?? 0,
    enabled: open && roomId !== null,
    lastMessageId,
    onJoined: (response) => {
      if (response.missedMessages.messages.length > 0) {
        appendMessages(response.missedMessages.messages);
      }

      if (response.missedMessages.hasMore) {
        void messagesQuery.refetch();
      }
    },
    onJoinError: handleSocketError,
    onMessage: (message) => appendMessages([message]),
  });

  const revokeSelectedImagePreview = useCallback(() => {
    if (!selectedImagePreviewUrlRef.current) {
      return;
    }

    URL.revokeObjectURL(selectedImagePreviewUrlRef.current);
    selectedImagePreviewUrlRef.current = null;
  }, []);

  const clearSelectedImage = useCallback(() => {
    revokeSelectedImagePreview();
    setSelectedImageFile(null);
    setSelectedImagePreviewUrl(null);
  }, [revokeSelectedImagePreview]);

  const selectImageFile = useCallback(
    (file: File) => {
      if (isComposerDisabled) {
        setToastMessage(room?.messageDisabledReason ?? t("messageDisabled"));
        return;
      }

      const validationMessage = validateChatImageFile(
        file,
        t("imageTypeError"),
        t("imageSizeError"),
      );

      if (validationMessage) {
        setToastMessage(validationMessage);
        return;
      }

      revokeSelectedImagePreview();

      const previewUrl = URL.createObjectURL(file);
      selectedImagePreviewUrlRef.current = previewUrl;
      setSelectedImageFile(file);
      setSelectedImagePreviewUrl(previewUrl);
      setMessageValue("");
      setToastMessage(null);
    },
    [isComposerDisabled, revokeSelectedImagePreview, room?.messageDisabledReason, t],
  );

  useEffect(() => () => revokeSelectedImagePreview(), [revokeSelectedImagePreview]);

  const sendSelectedImageMessage = async (file: File) => {
    if (roomId === null || isComposerDisabled || isSending || isImageSending) {
      return;
    }

    const contentType = file.type;

    if (!isChatImageContentType(contentType)) {
      setToastMessage(t("imageTypeError"));
      return;
    }

    setToastMessage(null);
    setIsImageSending(true);

    try {
      const uploadResult = await getChatImageUploadUrl(roomId, {
        contentType,
        size: file.size,
      });

      await uploadFileToPresignedUrl(uploadResult.uploadUrl, file);

      const response = await sendImageMessage({
        roomId,
        imageKey: uploadResult.key,
        clientMessageId: createClientMessageId(),
      });

      if (!response.ok) {
        setToastMessage(response.error.message);
        return;
      }

      clearSelectedImage();
    } catch (error) {
      setToastMessage(getApiErrorMessage(error, t("imageAttachFailed")));
    } finally {
      setIsImageSending(false);
    }
  };

  const handleSendMessage = async () => {
    if (roomId === null || isComposerDisabled) {
      return;
    }

    if (selectedImageFile) {
      await sendSelectedImageMessage(selectedImageFile);
      return;
    }

    const content = messageValue.trim();

    if (!content || isSending) {
      return;
    }

    setToastMessage(null);
    setIsSending(true);

    try {
      const response = await sendMessage({
        roomId,
        content,
        clientMessageId: createClientMessageId(),
      });

      if (!response.ok) {
        setToastMessage(response.error.message);
        return;
      }

      setMessageValue("");
    } finally {
      setIsSending(false);
    }
  };

  const handleRequestEstimateRevision = async (input: RequestEstimateRevisionInput) => {
    if (roomId === null || isComposerDisabled || isSending || isImageSending) {
      return false;
    }

    setToastMessage(null);
    setIsSending(true);

    try {
      const response = await requestEstimateRevision({
        roomId,
        requestedMoveDate: input.requestedMoveDate,
        requestedPrice: input.requestedPrice,
        requestedComment: input.requestedComment,
        clientMessageId: createClientMessageId(),
      });

      if (!response.ok) {
        setToastMessage(response.error.message);
        return false;
      }

      appendMessages([response.message]);
      return true;
    } finally {
      setIsSending(false);
    }
  };

  const handleRespondEstimateRevision = async (
    revisionId: number,
    responseType: "APPROVED" | "REJECTED",
  ) => {
    if (roomId === null || isComposerDisabled || isSending || isImageSending) {
      return;
    }

    setToastMessage(null);
    setIsSending(true);

    try {
      const response = await respondEstimateRevision({
        roomId,
        revisionId,
        response: responseType,
        clientMessageId: createClientMessageId(),
      });

      if (!response.ok) {
        setToastMessage(response.error.message);
        return;
      }

      appendMessages([response.message]);

      if (responseType === "APPROVED") {
        await Promise.all([
          queryClient.invalidateQueries({ queryKey: QUERY_KEYS.ESTIMATES.DETAIL_ROOT }),
          queryClient.invalidateQueries({ queryKey: QUERY_KEYS.ESTIMATES.PENDING_LIST_ROOT }),
          queryClient.invalidateQueries({ queryKey: QUERY_KEYS.ESTIMATES.RECEIVED }),
          queryClient.invalidateQueries({ queryKey: QUERY_KEYS.ESTIMATES.SENT_DETAIL_ROOT }),
          queryClient.invalidateQueries({ queryKey: QUERY_KEYS.ESTIMATES.SENT_LIST_ROOT }),
        ]);
      }
    } finally {
      setIsSending(false);
    }
  };

  const messagesErrorMessage = messagesQuery.isError
    ? getApiErrorMessage(messagesQuery.error, t("messagesLoadFailed"))
    : null;

  return {
    messageValue,
    setMessageValue,
    selectedImageName: selectedImageFile?.name ?? "",
    selectedImagePreviewUrl,
    messages,
    messagesErrorMessage,
    isMessagesPending: messagesQuery.isPending,
    isMessagesError: messagesQuery.isError,
    isFetchingNextPage: messagesQuery.isFetchingNextPage,
    hasNextPage: Boolean(messagesQuery.hasNextPage),
    fetchNextPage: messagesQuery.fetchNextPage,
    refetchMessages: messagesQuery.refetch,
    isSending,
    isImageSending,
    isConnected,
    isComposerDisabled,
    messageDisabledReason: room?.messageDisabledReason ?? null,
    sendDisabled: isComposerDisabled || isSending || isImageSending || !isConnected,
    requestEstimateRevision: handleRequestEstimateRevision,
    respondEstimateRevision: handleRespondEstimateRevision,
    selectImageFile,
    clearSelectedImage,
    handleSendMessage,
    toastMessage,
    clearToastMessage: () => setToastMessage(null),
  };
}
