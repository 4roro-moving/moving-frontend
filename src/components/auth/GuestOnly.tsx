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
 * 로그인·회원가입 전용 — 이미 인증된 사용자는 예약 경로 또는 역할 홈으로 보냄
 * 로그인/가입 폼은 establishSession 전에 setPostAuthRedirectPath로 목적지를 예약합니다.
 */
const GuestOnly = ({ children }: GuestOnlyProps) => {
  const router = useRouter();
  const hasHydrated = useAuthStore((state) => state.hasHydrated);
  const isCheckingAuth = useAuthStore((state) => state.isCheckingAuth);
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const role = useAuthStore((state) => state.user?.role);

  useEffect(() => {
    if (!hasHydrated || isCheckingAuth || !isAuthenticated) return;

    const intentPath =
      useAuthStore.getState().consumePostAuthRedirectPath() ??
      getAuthenticatedAuthPageRedirectPath(role ?? loadRole());

    router.replace(intentPath);
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
