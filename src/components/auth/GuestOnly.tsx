"use client";

import { useEffect, type ReactNode } from "react";
import { useRouter } from "next/navigation";

import {
  getAuthAudienceFromRole,
  getLoginRedirectParam,
  getPostAuthRedirectPath,
} from "@/lib/auth/redirect";
import { useAuthStore } from "@/stores/useAuthStore";

interface GuestOnlyProps {
  children: ReactNode;
}

/**
 * 로그인·회원가입 전용 — 이미 인증된 사용자는 role 홈으로 보냄
 */
const GuestOnly = ({ children }: GuestOnlyProps) => {
  const router = useRouter();
  const hasHydrated = useAuthStore((state) => state.hasHydrated);
  const isCheckingAuth = useAuthStore((state) => state.isCheckingAuth);
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const role = useAuthStore((state) => state.user?.role);

  useEffect(() => {
    if (!hasHydrated || isCheckingAuth || !isAuthenticated) return;

    let cancelled = false;

    const redirectAuthenticatedUser = async () => {
      const nextPath = await getPostAuthRedirectPath({
        audience: getAuthAudienceFromRole(role),
        returnPath: getLoginRedirectParam(),
      });

      if (cancelled) return;
      router.replace(nextPath);
    };

    void redirectAuthenticatedUser();

    return () => {
      cancelled = true;
    };
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
