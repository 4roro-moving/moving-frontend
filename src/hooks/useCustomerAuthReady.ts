"use client";

import { useAuthStore } from "@/stores/useAuthStore";

/**
 * 고객 전용 API·화면용 인증 준비 상태
 * AuthProvider의 checkAuth가 끝나기 전에는 canFetch=false 로 보호 API 호출을 막습니다.
 * // 2026.07.30 정슬기 - [추가] 견적 관리·리뷰 로그인 연동
 * // 2026.07.30 정슬기 - [수정] canAccess와 동일하던 중복 제거 → canFetch로 통일
 * // 2026.08.03 정슬기 - [수정] !MOVER 제외 → CUSTOMER 명시 확인 (ADMIN·역할 미확정 오인 방지)
 */
export function useCustomerAuthReady() {
  const hasHydrated = useAuthStore((state) => state.hasHydrated);
  const isCheckingAuth = useAuthStore((state) => state.isCheckingAuth);
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const user = useAuthStore((state) => state.user);

  const isPending = !hasHydrated || isCheckingAuth;
  const isCustomer = user?.role === "CUSTOMER";
  const isMover = user?.role === "MOVER";
  /** 세션 준비·CUSTOMER 로그인 시에만 true (쿼리 enabled·화면 접근 공통) */
  const canFetch = !isPending && isAuthenticated && isCustomer;

  return {
    isPending,
    isAuthenticated,
    isCustomer,
    isMover,
    canFetch,
    user,
  };
}
