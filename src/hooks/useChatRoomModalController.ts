"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";

import { useChatMessages } from "@/hooks/useChatMessages";
import { useChatRoomSocket } from "@/hooks/useChatRoomSocket";
import { useGetOrCreateChatRoom } from "@/hooks/useChatRoom";
import { getApiErrorMessage } from "@/lib/api/getApiErrorMessage";
import type { ChatMessage, ChatRoom, ChatSocketError } from "@/types/chat";

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

/**
 * 채팅 모달 진입 시 견적 기준 채팅방을 준비하는 훅
 * // 2026.08.07 김성현 - [추가] 채팅방 생성/조회 로직 분리
 */
export function useChatRoomModalController({
  open,
  estimateId,
}: UseChatRoomModalControllerOptions) {
  const [room, setRoom] = useState<ChatRoom | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const requestedEstimateIdRef = useRef<number | null>(null);
  const { mutate: getOrCreateChatRoom, isPending: isChatRoomPending } = useGetOrCreateChatRoom();
  const activeRoom = room?.estimateId === estimateId ? room : null;

  useEffect(() => {
    if (!open) {
      requestedEstimateIdRef.current = null;
      return;
    }

    if (activeRoom || requestedEstimateIdRef.current === estimateId) {
      return;
    }

    requestedEstimateIdRef.current = estimateId;
    setToastMessage(null);

    getOrCreateChatRoom(
      { estimateId },
      {
        onSuccess: (nextRoom) => {
          setRoom(nextRoom);
        },
        onError: (error) => {
          requestedEstimateIdRef.current = null;
          setToastMessage(getApiErrorMessage(error, "채팅방을 준비하지 못했습니다."));
        },
      },
    );
  }, [activeRoom, estimateId, getOrCreateChatRoom, open]);

  return {
    activeRoom,
    isChatRoomPending,
    toastMessage,
    clearToastMessage: () => setToastMessage(null),
  };
}

/**
 * 준비된 채팅방의 메시지 조회, 소켓 수신, 전송 상태를 관리하는 훅
 * // 2026.08.07 김성현 - [추가] 채팅 메시지/소켓 로직 분리
 */
export function useConnectedChatRoomModalController({
  open,
  room,
}: UseConnectedChatRoomModalControllerOptions) {
  const [messageValue, setMessageValue] = useState("");
  const [liveMessages, setLiveMessages] = useState<ChatMessage[]>([]);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [isSending, setIsSending] = useState(false);

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

  const { isConnected, sendMessage } = useChatRoomSocket({
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

    const response = await sendMessage({
      roomId: room.id,
      content,
      clientMessageId: createClientMessageId(),
    });

    setIsSending(false);

    if (!response.ok) {
      setToastMessage(response.error.message);
      return;
    }

    setMessageValue("");
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
    isConnected,
    sendDisabled: isSending || !isConnected,
    handleSendMessage,
    toastMessage,
    clearToastMessage: () => setToastMessage(null),
  };
}
