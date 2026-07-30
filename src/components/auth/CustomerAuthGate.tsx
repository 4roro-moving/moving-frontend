"use client";

import { usePathname, useRouter } from "next/navigation";
import { useEffect, type ReactNode } from "react";

import EstimatesQueryStatus from "@/components/estimate/EstimatesQueryStatus";
import { useCustomerAuthReady } from "@/hooks/useCustomerAuthReady";
import { buildLoginPath } from "@/lib/auth/redirect";

interface CustomerAuthGateProps {
  children: ReactNode;
  /** 세션 확인 중 표시. 기본은 공통 로딩 메시지 */
  loadingMessage?: string;
}

/**
 * 고객 전용 영역 가드
 * - 세션 복구 중: 로딩
 * - 비로그인: 로그인 페이지로 이동 (?redirect=)
 * - 기사님: 받은 견적 요청 목록으로 이동
 * // 2026.07.30 정슬기 - [추가]
 */
export default function CustomerAuthGate({
  children,
  loadingMessage = "로그인 상태를 확인하는 중입니다.",
}: CustomerAuthGateProps) {
  const router = useRouter();
  const pathname = usePathname();
  const { isPending, isAuthenticated, isMover, canAccess } = useCustomerAuthReady();

  useEffect(() => {
    if (isPending) return;

    if (!isAuthenticated) {
      const search = typeof window !== "undefined" ? window.location.search : "";
      window.location.assign(buildLoginPath(`${pathname}${search}`));
      return;
    }

    if (isMover) {
      router.replace("/estimate/received-requests");
    }
  }, [isPending, isAuthenticated, isMover, pathname, router]);

  if (isPending || !canAccess) {
    return <EstimatesQueryStatus message={loadingMessage} />;
  }

  return children;
}
