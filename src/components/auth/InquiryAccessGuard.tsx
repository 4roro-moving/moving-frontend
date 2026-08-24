"use client";

import { useEffect, useState, type ReactNode } from "react";

import RoleGuard from "@/components/auth/RoleGuard";
import { hasSuspensionAppealSession } from "@/lib/auth/suspensionAppealSession";
import type { AuthRole } from "@/lib/auth/role";

interface InquiryAccessGuardProps {
  allowedRole: readonly AuthRole[];
  children: ReactNode;
  unauthenticatedFallback: ReactNode;
}

/** 일반 로그인 또는 정지 이의 제기 제한 세션에만 문의 화면을 허용한다. */
const InquiryAccessGuard = ({
  allowedRole,
  children,
  unauthenticatedFallback,
}: InquiryAccessGuardProps) => {
  const [isReady, setIsReady] = useState(false);
  const [hasAppealAccess, setHasAppealAccess] = useState(false);

  useEffect(() => {
    const timerId = window.setTimeout(() => {
      setHasAppealAccess(hasSuspensionAppealSession());
      setIsReady(true);
    }, 0);

    return () => window.clearTimeout(timerId);
  }, []);

  if (!isReady) {
    return null;
  }

  if (hasAppealAccess) {
    return children;
  }

  return (
    <RoleGuard allowedRole={allowedRole} unauthenticatedFallback={unauthenticatedFallback}>
      {children}
    </RoleGuard>
  );
};

export default InquiryAccessGuard;
