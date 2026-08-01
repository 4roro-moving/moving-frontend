"use client";

import { useQueryClient } from "@tanstack/react-query";
import { useEffect, useRef } from "react";

import { useAuthQueryScope } from "@/hooks/useAuthQueryScope";
import { useAuthStore } from "@/stores/useAuthStore";

/** 로그인·로그아웃·계정 전환 시 이전 사용자의 React Query 캐시를 제거합니다. */
export function useAuthQueryCacheReset() {
  const queryClient = useQueryClient();
  const isCheckingAuth = useAuthStore((state) => state.isCheckingAuth);
  const sessionKey = useAuthQueryScope();
  const previousSessionKeyRef = useRef<string | null>(null);

  useEffect(() => {
    if (isCheckingAuth) {
      return;
    }

    const previousSessionKey = previousSessionKeyRef.current;

    // 최초 인증 확정 시에는 SSR prefetch 캐시를 유지하고, 이후 세션 전환만 정리합니다.
    if (previousSessionKey !== null && previousSessionKey !== sessionKey) {
      queryClient.clear();
    }

    previousSessionKeyRef.current = sessionKey;
  }, [isCheckingAuth, queryClient, sessionKey]);
}
