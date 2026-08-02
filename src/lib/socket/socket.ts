"use client";

import { io, type Socket } from "socket.io-client";

import { getAccessToken } from "@/lib/auth/token";

const API_URL = process.env.NEXT_PUBLIC_API_BASE_URL || process.env.NEXT_PUBLIC_API_URL;
const SOCKET_URL = process.env.NEXT_PUBLIC_SOCKET_URL || API_URL?.replace(/\/api\/?$/, "");

let socket: Socket | null = null;

export const getSocket = (): Socket => {
  if (!SOCKET_URL) {
    throw new Error("Socket URL이 설정되지 않았습니다.");
  }

  if (!socket) {
    socket = io(SOCKET_URL, {
      autoConnect: false,
      withCredentials: true,
      auth: () => ({
        token: getAccessToken(),
      }),
    });
  }

  return socket;
};

export const disconnectSocket = (): void => {
  socket?.disconnect();
};
