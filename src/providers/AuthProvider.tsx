"use client";

import { type ReactNode } from "react";

import { useAuthInit } from "@/hooks/useAuthInit";
import { useAuthQueryCacheReset } from "@/hooks/useAuthQueryCacheReset";

interface AuthProviderProps {
  children: ReactNode;
}

/** 세션 초기화·만료 리스너와 사용자 전환 시 쿼리 캐시 정리를 담당합니다. */
export const AuthProvider = ({ children }: AuthProviderProps) => {
  useAuthInit();
  useAuthQueryCacheReset();
  return children;
};
