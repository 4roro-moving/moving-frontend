"use client";

import { useAuthStore } from "@/stores/useAuthStore";

/**
 * 기사 전용 API·화면용 인증 준비 상태
 * AuthProvider의 checkAuth가 끝나기 전에는 canFetch=false 로 보호 API 호출을 막습니다.
 * CUSTOMER 제외가 아니라 MOVER 명시 확인으로 ADMIN·역할 미확정 오인을 방지합니다.
 */
export const useMoverAuthReady = () => {
  const hasHydrated = useAuthStore((state) => state.hasHydrated);
  const isCheckingAuth = useAuthStore((state) => state.isCheckingAuth);
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const user = useAuthStore((state) => state.user);

  const isPending = !hasHydrated || isCheckingAuth;
  const isMover = user?.role === "MOVER";
  const isCustomer = user?.role === "CUSTOMER";
  /** 세션 준비·MOVER 로그인 시에만 true (쿼리 enabled·화면 접근 공통) */
  const canFetch = !isPending && isAuthenticated && isMover;

  return {
    isPending,
    isAuthenticated,
    isMover,
    isCustomer,
    canFetch,
    user,
  };
};
