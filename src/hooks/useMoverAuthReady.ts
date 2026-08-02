"use client";

import { useAuthStore } from "@/stores/useAuthStore";

/**
 * 기사 전용 API·화면용 인증 준비 상태
 * AuthProvider의 checkAuth가 끝나기 전에는 canFetch=false 로 보호 API 호출을 막습니다.
 */
export const useMoverAuthReady = () => {
  const hasHydrated = useAuthStore((state) => state.hasHydrated);
  const isCheckingAuth = useAuthStore((state) => state.isCheckingAuth);
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const user = useAuthStore((state) => state.user);

  const isPending = !hasHydrated || isCheckingAuth;
  const isCustomer = user?.role === "CUSTOMER";
  const canFetch = !isPending && isAuthenticated && !isCustomer;

  return {
    isPending,
    isAuthenticated,
    isCustomer,
    canFetch,
    user,
  };
};
