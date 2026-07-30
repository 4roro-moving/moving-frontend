"use client";

import { usePathname } from "next/navigation";
import type { ReactNode } from "react";

import CustomerAuthGate from "@/components/auth/CustomerAuthGate";
import MyEstimateTabs from "@/components/estimate/MyEstimateTabs";

interface EstimatesShellProps {
  children: ReactNode;
}

// 2026.07.24 정슬기 - [수정] /estimates/[estimateId] 상세에서는 목록 탭을 숨김
// 2026.07.25 정슬기 - [수정] /estimates/pending/[estimateId] 상세에서도 탭 숨김
// 2026.07.29 정슬기 - [수정] 보낸 견적 요청 목록에서도 탭 표시
// 2026.07.30 정슬기 - [수정] CustomerAuthGate로 로그인·고객 권한 연동
function shouldShowTabs(pathname: string): boolean {
  return (
    pathname === "/estimates/pending" ||
    pathname === "/estimates/received" ||
    pathname === "/estimates/requests"
  );
}

export default function EstimatesShell({ children }: EstimatesShellProps) {
  const pathname = usePathname();

  return (
    <CustomerAuthGate loadingMessage="견적 관리를 불러오는 중입니다.">
      {shouldShowTabs(pathname) ? <MyEstimateTabs /> : null}
      {children}
    </CustomerAuthGate>
  );
}
