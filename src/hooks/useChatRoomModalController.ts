"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";

import { useChatMessages } from "@/hooks/useChatMessages";
import { useChatRoomSocket } from "@/hooks/useChatRoomSocket";
import { useGetOrCreateChatRoom } from "@/hooks/useChatRoom";
import { getChatImageUploadUrl } from "@/lib/api/chat";
import { getApiErrorMessage } from "@/lib/api/getApiErrorMessage";
import { uploadFileToPresignedUrl } from "@/lib/api/profileImage";
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
  room: ChatRoom;
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

function validateChatImageFile(file: File): string | null {
  if (!isChatImageContentType(file.type)) {
    return "jpg, png, webp 형식의 이미지만 첨부할 수 있습니다.";
  }

  if (file.size > CHAT_IMAGE_MAX_SIZE) {
    return "채팅 이미지는 25MB 이하만 첨부할 수 있습니다.";
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
          setCreateErrorMessage(
            getApiErrorMessage(error, "일시적인 오류로 채팅방을 열 수 없습니다."),
          );
        },
      },
    );
  }, [estimateId, getOrCreateChatRoom]);

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
 */
export function useConnectedChatRoomModalController({
  open,
  room,
}: UseConnectedChatRoomModalControllerOptions) {
  const [messageValue, setMessageValue] = useState("");
  const [liveMessages, setLiveMessages] = useState<ChatMessage[]>([]);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [isSending, setIsSending] = useState(false);
  const [isImageSending, setIsImageSending] = useState(false);

  const messagesQuery = useChatMessages({
    roomId: room.id,
    enabled: open,
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

  const { isConnected, sendImageMessage, sendMessage } = useChatRoomSocket({
    roomId: room.id,
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

  const handleSendMessage = async () => {
    const content = messageValue.trim();

    if (!content || isSending) {
      return;
    }

    setToastMessage(null);
    setIsSending(true);

    try {
      const response = await sendMessage({
        roomId: room.id,
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

  const handleSendImageMessage = async (file: File) => {
    if (isSending || isImageSending) {
      return;
    }

    const contentType = file.type;
    const validationMessage = validateChatImageFile(file);

    if (validationMessage) {
      setToastMessage(validationMessage);
      return;
    }

    if (!isChatImageContentType(contentType)) {
      return;
    }

    setToastMessage(null);
    setIsImageSending(true);

    try {
      const uploadResult = await getChatImageUploadUrl(room.id, {
        contentType,
        size: file.size,
      });

      await uploadFileToPresignedUrl(uploadResult.uploadUrl, file);

      const response = await sendImageMessage({
        roomId: room.id,
        imageKey: uploadResult.key,
        clientMessageId: createClientMessageId(),
      });

      if (!response.ok) {
        setToastMessage(response.error.message);
      }
    } catch (error) {
      setToastMessage(getApiErrorMessage(error, "이미지를 첨부하지 못했습니다."));
    } finally {
      setIsImageSending(false);
    }
  };

  const messagesErrorMessage = messagesQuery.isError
    ? getApiErrorMessage(messagesQuery.error, "대화 내역을 불러오지 못했습니다.")
    : null;

  return {
    messageValue,
    setMessageValue,
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
    sendDisabled: isSending || isImageSending || !isConnected,
    handleSendMessage,
    handleSendImageMessage,
    toastMessage,
    clearToastMessage: () => setToastMessage(null),
  };
}
