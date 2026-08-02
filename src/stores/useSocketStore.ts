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

export const useSocketStore = create<SocketState>((set, get) => ({
  socket: null,
  isConnected: false,

  connect: () => {
    const socket = get().socket ?? getSocket();

    socket.off("connect");
    socket.off("disconnect");

    socket.on("connect", () => {
      set({ isConnected: true });
    });

    socket.on("disconnect", () => {
      set({ isConnected: false });
    });

    if (!socket.connected) {
      socket.connect();
    }

    set({ socket });

    return socket;
  },

  disconnect: () => {
    disconnectSocket();
    set({ isConnected: false });
  },
}));
