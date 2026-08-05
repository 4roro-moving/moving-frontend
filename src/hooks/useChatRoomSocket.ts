"use client";

import { useCallback, useEffect, useRef } from "react";

import { useChatSocket } from "@/hooks/useChatSocket";
import type {
  ChatRoomJoinedPayload,
  ChatMessage,
  JoinChatRoomAck,
  JoinChatRoomPayload,
  SendChatMessageAck,
  SendChatMessagePayload,
} from "@/types/chat";

interface UseChatRoomSocketOptions {
  roomId: number;
  lastMessageId?: number | null;
  onJoined?: (response: ChatRoomJoinedPayload) => void;
  onJoinError?: (error: Extract<JoinChatRoomAck, { ok: false }>["error"]) => void;
  onMessage?: (message: ChatMessage) => void;
}

export function useChatRoomSocket({
  roomId,
  lastMessageId,
  onJoined,
  onJoinError,
  onMessage,
}: UseChatRoomSocketOptions) {
  const { socket, isConnected, canConnect } = useChatSocket();
  const lastMessageIdRef = useRef<number | null>(lastMessageId ?? null);

  useEffect(() => {
    lastMessageIdRef.current = lastMessageId ?? null;
  }, [lastMessageId]);

  useEffect(() => {
    if (!socket || !canConnect) {
      return;
    }

    const handleJoined = (response: ChatRoomJoinedPayload) => {
      onJoined?.(response);
    };

    const handleMessage = (message: ChatMessage) => {
      if (message.roomId === roomId) {
        onMessage?.(message);
      }
    };

    socket.on("chat:room:joined", handleJoined);
    socket.on("chat:message:new", handleMessage);

    return () => {
      socket.off("chat:room:joined", handleJoined);
      socket.off("chat:message:new", handleMessage);
    };
  }, [canConnect, onJoined, onMessage, roomId, socket]);

  useEffect(() => {
    if (!socket || !isConnected || !canConnect) {
      return;
    }

    const payload: JoinChatRoomPayload = {
      roomId,
      lastMessageId: lastMessageIdRef.current,
    };

    socket.emit("chat:room:join", payload, (response: JoinChatRoomAck) => {
      if (!response.ok) {
        onJoinError?.(response.error);
      }
    });
  }, [canConnect, isConnected, onJoinError, roomId, socket]);

  const sendMessage = useCallback(
    (payload: SendChatMessagePayload) =>
      new Promise<SendChatMessageAck>((resolve) => {
        if (!socket || !isConnected) {
          resolve({
            ok: false,
            error: {
              code: "SOCKET_DISCONNECTED",
              message: "채팅 서버에 연결되어 있지 않습니다.",
            },
            clientMessageId: payload.clientMessageId,
          });
          return;
        }

        socket.emit("chat:message:send", payload, resolve);
      }),
    [isConnected, socket],
  );

  return {
    socket,
    isConnected,
    canConnect,
    sendMessage,
  };
}
