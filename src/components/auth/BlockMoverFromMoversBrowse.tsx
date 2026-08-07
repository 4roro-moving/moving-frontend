"use client";

import { useEffect, type ReactNode } from "react";
import { useRouter } from "next/navigation";

import { getRoleHomePath } from "@/lib/auth/redirect";
import type { AuthRole } from "@/lib/auth/role";
import { useAuthStore } from "@/stores/useAuthStore";

interface BlockMoverFromMoversBrowseProps {
  children: ReactNode;
  /** Server role 쿠키 힌트 — SSR/CSR 첫 페인트 일치·목록 미노출용 */
  initialRole?: AuthRole | null;
}

/**
 * 기사님 찾기·상세 등 `/movers` 공개 탐색은 고객/비로그인 전용.
 * MOVER가 히스토리·URL로 진입하면 역할 홈으로 보냅니다.
 * initialRole(서버 쿠키)이 MOVER이면 checkAuth 전·SSR에서도 목록을 그리지 않습니다.
 */
const BlockMoverFromMoversBrowse = ({
  children,
  initialRole = null,
}: BlockMoverFromMoversBrowseProps) => {
  const router = useRouter();
  const hasHydrated = useAuthStore((state) => state.hasHydrated);
  const isCheckingAuth = useAuthStore((state) => state.isCheckingAuth);
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const role = useAuthStore((state) => state.user?.role);

  const isAuthReady = hasHydrated && !isCheckingAuth;
  /** 세션 확정 후: 실제 MOVER만 차단·리다이렉트 */
  const shouldBlock = isAuthReady && isAuthenticated && role === "MOVER";
  /**
   * checkAuth 전: 서버와 동일한 initialRole 힌트만 사용 (loadRole는 SSR 불일치 유발)
   * 힌트만 있고 최종이 비로그인/고객이면 isAuthReady 후 children 복구
   */
  const shouldHideContent =
    shouldBlock || (!isAuthReady && (role === "MOVER" || initialRole === "MOVER"));

  useEffect(() => {
    if (!shouldBlock) return;
    router.replace(getRoleHomePath("MOVER"));
  }, [shouldBlock, router]);

  if (shouldHideContent) {
    return null;
  }

  return children;
};

export default BlockMoverFromMoversBrowse;
