"use client";

import type { Socket } from "socket.io-client";
import { create } from "zustand";

import { disconnectSocket, getSocket } from "@/lib/socket/socket";

interface SocketState {
  socket: Socket | null;
  isConnected: boolean;
  connect: () => Socket;
  disconnect: () => void;
}

export const useSocketStore = create<SocketState>((set, get) => {
  const handleConnect = () => {
    set({ isConnected: true });
  };

  const handleDisconnect = () => {
    set({ isConnected: false });
  };

  return {
    socket: null,
    isConnected: false,

    connect: () => {
      const currentSocket = get().socket;
      const socket = currentSocket ?? getSocket();

      if (!currentSocket) {
        socket.on("connect", handleConnect);
        socket.on("disconnect", handleDisconnect);
      }

      if (!socket.connected) {
        socket.connect();
      }

      set({ socket });

      return socket;
    },

    disconnect: () => {
      const socket = get().socket;

      socket?.off("connect", handleConnect);
      socket?.off("disconnect", handleDisconnect);

      disconnectSocket();
      set({ socket: null, isConnected: false });
    },
  };
});
