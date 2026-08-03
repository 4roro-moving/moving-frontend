"use client";

import { useEffect } from "react";

import { getAccessToken } from "@/lib/auth/token";
import { useAuthStore } from "@/stores/useAuthStore";
import { useSocketStore } from "@/stores/useSocketStore";

export const useChatSocket = () => {
  const connect = useSocketStore((state) => state.connect);
  const disconnect = useSocketStore((state) => state.disconnect);
  const socket = useSocketStore((state) => state.socket);
  const isConnected = useSocketStore((state) => state.isConnected);
  const hasHydrated = useAuthStore((state) => state.hasHydrated);
  const isCheckingAuth = useAuthStore((state) => state.isCheckingAuth);
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);

  const canConnect = hasHydrated && !isCheckingAuth && isAuthenticated;

  useEffect(() => {
    if (!canConnect || !getAccessToken()) {
      if (socket) {
        disconnect();
      }

      return;
    }

    connect();
  }, [canConnect, connect, disconnect, socket]);

  return {
    socket,
    isConnected,
    canConnect,
  };
};
