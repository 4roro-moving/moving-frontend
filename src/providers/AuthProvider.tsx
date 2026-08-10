"use client";

import { type ReactNode } from "react";

import { useAuthInit } from "@/hooks/useAuthInit";

interface AuthProviderProps {
  children: ReactNode;
  hasRefreshCookie?: boolean;
}

/** 세션 초기화·만료 리스너만 담당. 상태는 useAuthStore를 구독합니다. */
export const AuthProvider = ({ children, hasRefreshCookie = false }: AuthProviderProps) => {
  useAuthInit({ hasRefreshCookie });
  return children;
};
