"use client";

import { useEffect, type ReactNode } from "react";
import { useRouter } from "next/navigation";

import { getAuthenticatedAuthPageRedirectPath } from "@/lib/auth/redirect";
import { loadRole } from "@/lib/auth/role";
import { getAccessToken } from "@/lib/auth/token";
import { useAuthStore } from "@/stores/useAuthStore";

interface GuestOnlyProps {
  children: ReactNode;
}

/**
 * 로그인·회원가입 전용 — 이미 인증된 사용자는 역할 홈으로 보냄 (profile API 없음)
 */
const GuestOnly = ({ children }: GuestOnlyProps) => {
  const router = useRouter();
  const hasHydrated = useAuthStore((state) => state.hasHydrated);
  const isCheckingAuth = useAuthStore((state) => state.isCheckingAuth);
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const role = useAuthStore((state) => state.user?.role);

  useEffect(() => {
    if (!hasHydrated) return;

    const resolvedRole = role ?? loadRole();
    const hasAccessToken = Boolean(getAccessToken());

    // access + role 힌트가 있으면 checkAuth 완료를 기다리지 않음
    if (hasAccessToken && resolvedRole) {
      router.replace(getAuthenticatedAuthPageRedirectPath(resolvedRole));
      return;
    }

    if (isCheckingAuth) return;
    if (!isAuthenticated) return;

    router.replace(getAuthenticatedAuthPageRedirectPath(role ?? loadRole()));
  }, [hasHydrated, isCheckingAuth, isAuthenticated, role, router]);

  if (!hasHydrated) {
    return null;
  }

  const resolvedRole = role ?? loadRole();
  const hasAccessToken = Boolean(getAccessToken());

  if (hasAccessToken && resolvedRole) {
    return null;
  }

  if (isCheckingAuth) {
    return null;
  }

  if (isAuthenticated) {
    return null;
  }

  return children;
};

export default GuestOnly;
