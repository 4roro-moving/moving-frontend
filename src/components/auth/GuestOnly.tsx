"use client";

import { useEffect, type ReactNode } from "react";
import { useRouter } from "next/navigation";

import {
  getAuthAudienceFromRole,
  getPostAuthRedirectPath,
  getRoleHomePath,
} from "@/lib/auth/redirect";
import { loadRole } from "@/lib/auth/role";
import { useAuthStore } from "@/stores/useAuthStore";

interface GuestOnlyProps {
  children: ReactNode;
}

/**
 * 로그인·회원가입 전용 — 이미 인증된 사용자는 예약 경로 또는
 * 프로필 완료 여부에 따른 경로(미완료 → 프로필 생성, 완료 → 역할 홈)로 보냄
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

    let cancelled = false;

    // 예약된 경로가 없으면 역할 홈으로 이동
    // 예약된 경로가 있으면 예약된 경로로 이동
    const redirect = async () => {
      const reservedPath = useAuthStore.getState().consumePostAuthRedirectPath();
      if (reservedPath) {
        if (!cancelled) router.replace(reservedPath);
        return;
      }

      const resolvedRole = role ?? loadRole();
      const intentPath = await getPostAuthRedirectPath({
        audience: getAuthAudienceFromRole(resolvedRole),
        fallbackPath: getRoleHomePath(resolvedRole),
      });

      if (!cancelled) router.replace(intentPath);
    };

    void redirect();
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
