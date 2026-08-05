"use client";

import { usePathname, useRouter } from "next/navigation";
import { useEffect, type ReactNode } from "react";

import EstimatesQueryStatus from "@/components/estimate/EstimatesQueryStatus";
import { useMoverAuthReady } from "@/hooks/useMoverAuthReady";
import { buildLoginPath, getRoleHomePath } from "@/lib/auth/redirect";

interface MoverAuthGateProps {
  children: ReactNode;
  /** 세션 확인 중 표시. 기본은 공통 로딩 메시지 */
  loadingMessage?: string;
  /** 세션 확인 중 커스텀 UI. 있으면 loadingMessage 대신 사용 */
  loadingFallback?: ReactNode;
}

/**
 * 기사님 전용 영역 가드
 * - 세션 복구 중: 로딩
 * - 비로그인: 기사 로그인 페이지로 이동 (?redirect=)
 * - MOVER 아님(고객·ADMIN·역할 미확정): getRoleHomePath로 이동
 *
 * // 2026.07.31 정슬기 - [추가] CustomerAuthGate와 대칭인 기사님 가드
 *
 * ADMIN 홈 경로는 getRoleHomePath의 임시 정책(기사님 찾기)을 그대로 사용합니다.
 */
const MoverAuthGate = ({
  children,
  loadingMessage = "로그인 상태를 확인하는 중입니다.",
  loadingFallback,
}: MoverAuthGateProps) => {
  const router = useRouter();
  const pathname = usePathname();
  const { isPending, isAuthenticated, isMover, canFetch, user } = useMoverAuthReady();

  useEffect(() => {
    if (isPending) return;

    if (!isAuthenticated) {
      const search = typeof window !== "undefined" ? window.location.search : "";
      router.replace(buildLoginPath(`${pathname}${search}`, "mover"));
      return;
    }

    if (!isMover) {
      router.replace(getRoleHomePath(user?.role));
    }
  }, [isPending, isAuthenticated, isMover, user?.role, pathname, router]);

  if (isPending || !canFetch) {
    return loadingFallback ?? <EstimatesQueryStatus message={loadingMessage} />;
  }

  return children;
};

export default MoverAuthGate;
