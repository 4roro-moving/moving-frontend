"use client";

import { usePathname } from "next/navigation";
import type { ReactNode } from "react";

import ReviewTabs from "@/components/review/ReviewTabs";
import { useCustomerAuthReady } from "@/hooks/useCustomerAuthReady";
import { APP_ROUTES } from "@/lib/constants/appRoutes";

interface ReviewsShellProps {
  children: ReactNode;
}

function shouldShowTabs(pathname: string): boolean {
  return pathname === APP_ROUTES.REVIEWS.WRITABLE || pathname === APP_ROUTES.REVIEWS.ME;
}

// 2026.07.27 정슬기 - [추가] 리뷰 페이지 공통 셸
// 2026.07.30 정슬기 - [수정] CustomerAuthGate로 로그인·고객 권한 연동
// 2026.07.31 정슬기 - [수정] AuthGate를 페이지로 내려 404가 layout 가드에 가로채지지 않도록 함
export default function ReviewsShell({ children }: ReviewsShellProps) {
  const pathname = usePathname();
  const { canFetch } = useCustomerAuthReady();

  return (
    <>
      {shouldShowTabs(pathname) && canFetch ? <ReviewTabs /> : null}
      {children}
    </>
  );
}
