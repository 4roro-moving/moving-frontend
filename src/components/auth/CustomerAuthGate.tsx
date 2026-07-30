"use client";

import { usePathname, useRouter } from "next/navigation";
import { useEffect, type ReactNode } from "react";

import EstimatesQueryStatus from "@/components/estimate/EstimatesQueryStatus";
import { useCustomerAuthReady } from "@/hooks/useCustomerAuthReady";
import { buildLoginPath, getRoleHomePath } from "@/lib/auth/redirect";

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
 * // 2026.07.30 정슬기 - [수정] 리다이렉트를 router.replace로 통일 (하드 새로고침 불필요)
 */
export default function CustomerAuthGate({
  children,
  loadingMessage = "로그인 상태를 확인하는 중입니다.",
}: CustomerAuthGateProps) {
  const router = useRouter();
  const pathname = usePathname();
  const { isPending, isAuthenticated, isMover, canFetch } = useCustomerAuthReady();

  useEffect(() => {
    if (isPending) return;

    // AuthProvider hydrate·checkAuth가 끝난 뒤의 역할/세션 분기이므로
    // 전체 새로고침(window.location.assign) 없이 App Router soft navigate로 충분합니다.
    // 로그인만 buildLoginPath로 ?redirect= 복귀 경로를 유지합니다.
    if (!isAuthenticated) {
      const search = typeof window !== "undefined" ? window.location.search : "";
      router.replace(buildLoginPath(`${pathname}${search}`));
      return;
    }

    if (isMover) {
      router.replace(getRoleHomePath("MOVER"));
    }
  }, [isPending, isAuthenticated, isMover, pathname, router]);

  if (isPending || !canFetch) {
    return <EstimatesQueryStatus message={loadingMessage} />;
  }

  return children;
}
