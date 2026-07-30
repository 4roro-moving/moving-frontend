"use client";

import { useEffect, type ReactNode } from "react";
import { useRouter } from "next/navigation";

import { getAuthenticatedAuthPageRedirectPath } from "@/lib/auth/redirect";
import { loadRole } from "@/lib/auth/role";
import { useAuthStore } from "@/stores/useAuthStore";

interface GuestOnlyProps {
  children: ReactNode;
}

/**
 * 로그인·회원가입 전용 — 이미 인증된 사용자는 역할 홈으로 보냄 (profile API 없음)
 * access 토큰만 있고 establishSession 전인 구간에서는 이동하지 않음 (audience 검증 레이스 방지)
 */
const GuestOnly = ({ children }: GuestOnlyProps) => {
  const router = useRouter();
  const hasHydrated = useAuthStore((state) => state.hasHydrated);
  const isCheckingAuth = useAuthStore((state) => state.isCheckingAuth);
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const role = useAuthStore((state) => state.user?.role);

  useEffect(() => {
    if (!hasHydrated || isCheckingAuth || !isAuthenticated) return;

    router.replace(getAuthenticatedAuthPageRedirectPath(role ?? loadRole()));
  }, [hasHydrated, isCheckingAuth, isAuthenticated, role, router]);

  if (!hasHydrated || isCheckingAuth) {
    return null;
  }

  if (isAuthenticated) {
    return null;
  }

  return children;
};

export default GuestOnly;
