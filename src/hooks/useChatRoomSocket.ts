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

const SOCKET_ACK_TIMEOUT_MS = 5000;

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
  const onJoinedRef = useRef(onJoined);
  const onJoinErrorRef = useRef(onJoinError);
  const onMessageRef = useRef(onMessage);

  useEffect(() => {
    lastMessageIdRef.current = lastMessageId ?? null;
  }, [lastMessageId]);

  useEffect(() => {
    onJoinedRef.current = onJoined;
    onJoinErrorRef.current = onJoinError;
    onMessageRef.current = onMessage;
  }, [onJoined, onJoinError, onMessage]);

  useEffect(() => {
    if (!socket || !canConnect) {
      return;
    }

    const handleJoined = (response: ChatRoomJoinedPayload) => {
      if (response.room.id === roomId) {
        onJoinedRef.current?.(response);
      }
    };

    const handleMessage = (message: ChatMessage) => {
      if (message.roomId === roomId) {
        onMessageRef.current?.(message);
      }
    };

    socket.on("chat:room:joined", handleJoined);
    socket.on("chat:message:new", handleMessage);

    return () => {
      socket.off("chat:room:joined", handleJoined);
      socket.off("chat:message:new", handleMessage);
    };
  }, [canConnect, roomId, socket]);

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
        onJoinErrorRef.current?.(response.error);
      }
    });
  }, [canConnect, isConnected, roomId, socket]);

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

        socket
          .timeout(SOCKET_ACK_TIMEOUT_MS)
          .emit(
            "chat:message:send",
            payload,
            (error: Error | null, response?: SendChatMessageAck) => {
              if (error) {
                resolve({
                  ok: false,
                  error: {
                    code: "SOCKET_TIMEOUT",
                    message: "채팅 서버 응답 시간이 초과되었습니다.",
                  },
                  clientMessageId: payload.clientMessageId,
                });
                return;
              }

              if (!response) {
                resolve({
                  ok: false,
                  error: {
                    code: "SOCKET_EMPTY_ACK",
                    message: "채팅 서버 응답이 올바르지 않습니다.",
                  },
                  clientMessageId: payload.clientMessageId,
                });
                return;
              }

              resolve(response);
            },
          );
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
