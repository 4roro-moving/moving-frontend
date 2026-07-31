"use client";

import { usePathname, useRouter } from "next/navigation";
import { useEffect, type ReactNode } from "react";

import EstimatesQueryStatus from "@/components/estimate/EstimatesQueryStatus";
import { useCustomerAuthReady } from "@/hooks/useCustomerAuthReady";
import { buildLoginPath } from "@/lib/auth/redirect";
import { APP_ROUTES } from "@/lib/constants/appRoutes";

interface MoverAuthGateProps {
  children: ReactNode;
  /** 세션 확인 중 표시. 기본은 공통 로딩 메시지 */
  loadingMessage?: string;
}

/**
 * 기사님 전용 영역 가드
 * - 세션 복구 중: 로딩
 * - 비로그인: 로그인 페이지로 이동 (?redirect=)
 * - 고객: 기사님 찾기(고객 홈)로 이동
 * // 2026.07.31 정슬기 - [추가] CustomerAuthGate와 대칭인 기사님 가드
 */
export default function MoverAuthGate({
  children,
  loadingMessage = "로그인 상태를 확인하는 중입니다.",
}: MoverAuthGateProps) {
  const router = useRouter();
  const pathname = usePathname();
  const { isPending, isAuthenticated, isMover } = useCustomerAuthReady();
  const canAccess = !isPending && isAuthenticated && isMover;

  useEffect(() => {
    if (isPending) return;

    if (!isAuthenticated) {
      const search = typeof window !== "undefined" ? window.location.search : "";
      router.replace(buildLoginPath(`${pathname}${search}`));
      return;
    }

    if (!isMover) {
      router.replace(APP_ROUTES.MOVERS.ROOT);
    }
  }, [isPending, isAuthenticated, isMover, pathname, router]);

  if (isPending || !canAccess) {
    return <EstimatesQueryStatus message={loadingMessage} />;
  }

  return children;
}
