"use client";

import type { ReactNode } from "react";
import { usePathname } from "next/navigation";

import ProfileCompletionGuard from "@/components/auth/ProfileCompletionGuard";
import RoleGuard from "@/components/auth/RoleGuard";
import { getMoverProtectedLoadingFallback } from "@/lib/loading/getMoverProtectedLoadingFallback";

interface MoverProtectedLayoutProps {
  children: ReactNode;
}

/**
 * 기사 `(protected)` Route Group 공통 가드.
 * 프로필 완료 검사는 이 layout의 ProfileCompletionGuard에서만 처리한다.
 * 하위 페이지에 MoverAuthGate(+ Guard)를 추가로 감싸지 말 것.
 */
const MoverProtectedLayout = ({ children }: MoverProtectedLayoutProps) => {
  const pathname = usePathname();
  const loadingFallback = getMoverProtectedLoadingFallback(pathname);

  return (
    <RoleGuard allowedRole="MOVER" loadingFallback={loadingFallback}>
      <ProfileCompletionGuard loadingFallback={loadingFallback}>{children}</ProfileCompletionGuard>
    </RoleGuard>
  );
};

export default MoverProtectedLayout;
