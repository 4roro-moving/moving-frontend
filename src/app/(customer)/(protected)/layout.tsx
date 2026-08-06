"use client";

import type { ReactNode } from "react";
import { usePathname } from "next/navigation";

import ProfileCompletionGuard from "@/components/auth/ProfileCompletionGuard";
import RoleGuard from "@/components/auth/RoleGuard";
import { getCustomerProtectedLoadingFallback } from "@/lib/loading/getCustomerProtectedLoadingFallback";

interface CustomerProtectedLayoutProps {
  children: ReactNode;
}

/**
 * 고객 `(protected)` Route Group 공통 가드.
 * 프로필 완료 검사는 이 layout의 ProfileCompletionGuard에서만 처리한다.
 * 하위 페이지에 CustomerAuthGate(+ Guard)를 추가로 감싸지 말 것.
 */
const CustomerProtectedLayout = ({ children }: CustomerProtectedLayoutProps) => {
  const pathname = usePathname();
  const loadingFallback = getCustomerProtectedLoadingFallback(pathname);

  return (
    <RoleGuard allowedRole="CUSTOMER" loadingFallback={loadingFallback}>
      <ProfileCompletionGuard loadingFallback={loadingFallback}>{children}</ProfileCompletionGuard>
    </RoleGuard>
  );
};

export default CustomerProtectedLayout;
