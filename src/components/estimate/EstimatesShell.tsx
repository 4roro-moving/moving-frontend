"use client";

import { usePathname } from "next/navigation";
import type { ReactNode } from "react";

import MyEstimateTabs from "@/components/estimate/MyEstimateTabs";
import { useCustomerAuthReady } from "@/hooks/useCustomerAuthReady";
import { APP_ROUTES } from "@/lib/constants/appRoutes";

interface EstimatesShellProps {
  children: ReactNode;
}

// 2026.07.24 정슬기 - [수정] /estimates/[estimateId] 상세에서는 목록 탭을 숨김
// 2026.07.25 정슬기 - [수정] /estimates/pending/[estimateId] 상세에서도 탭 숨김
// 2026.07.29 정슬기 - [수정] 보낸 견적 요청 목록에서도 탭 표시
// 2026.07.30 정슬기 - [수정] CustomerAuthGate로 로그인·고객 권한 연동
// 2026.07.31 정슬기 - [수정] AuthGate를 페이지로 내려 404가 layout 가드에 가로채지지 않도록 함
// 2026.07.31 정슬기 - [수정] 탭 경로를 APP_ROUTES로 통일
function shouldShowTabs(pathname: string): boolean {
  return (
    pathname === APP_ROUTES.ESTIMATES.PENDING ||
    pathname === APP_ROUTES.ESTIMATES.RECEIVED ||
    pathname === APP_ROUTES.ESTIMATES.REQUESTS
  );
}

export default function EstimatesShell({ children }: EstimatesShellProps) {
  const pathname = usePathname();
  const { canFetch } = useCustomerAuthReady();

  return (
    <>
      {shouldShowTabs(pathname) && canFetch ? <MyEstimateTabs /> : null}
      {children}
    </>
  );
}
