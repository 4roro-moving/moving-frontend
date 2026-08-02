"use client";

import { useEffect } from "react";

import { useSocketStore } from "@/stores/useSocketStore";

export const useChatSocket = () => {
  const connect = useSocketStore((state) => state.connect);
  const socket = useSocketStore((state) => state.socket);
  const isConnected = useSocketStore((state) => state.isConnected);

  useEffect(() => {
    const connectedSocket = connect();

    return () => {
      connectedSocket.off("chat:message");
      connectedSocket.off("chat:room:joined");
      connectedSocket.off("socket:error");
    };
  }, [connect]);

  return {
    socket,
    isConnected,
  };
};
