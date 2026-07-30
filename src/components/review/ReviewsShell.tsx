"use client";

import type { ReactNode } from "react";

import CustomerAuthGate from "@/components/auth/CustomerAuthGate";
import ReviewTabs from "@/components/review/ReviewTabs";

interface ReviewsShellProps {
  children: ReactNode;
}

// 2026.07.27 정슬기 - [추가] 리뷰 페이지 공통 셸
// 2026.07.30 정슬기 - [수정] CustomerAuthGate로 로그인·고객 권한 연동
export default function ReviewsShell({ children }: ReviewsShellProps) {
  return (
    <CustomerAuthGate loadingMessage="리뷰를 불러오는 중입니다.">
      <ReviewTabs />
      {children}
    </CustomerAuthGate>
  );
}
