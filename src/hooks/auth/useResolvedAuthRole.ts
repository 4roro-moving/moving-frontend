"use client";

import { loadRole, type AuthRole } from "@/lib/auth/role";
import { useAuthStore } from "@/stores/useAuthStore";

/**
 * Header·가드 공통 역할 힌트.
 * - hydrate / checkAuth 중: SSR `initialRole` 쿠키 힌트
 * - 세션 확정 후: store.user.role → 없으면 loadRole()
 */
export const useResolvedAuthRole = (initialRole: AuthRole | null = null): AuthRole | null => {
  const userRole = useAuthStore((state) => state.user?.role);
  const hasHydrated = useAuthStore((state) => state.hasHydrated);
  const isCheckingAuth = useAuthStore((state) => state.isCheckingAuth);

  return userRole ?? (!hasHydrated || isCheckingAuth ? initialRole : loadRole());
};
