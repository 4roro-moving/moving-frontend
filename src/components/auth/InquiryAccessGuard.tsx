"use client";

import { useEffect, useState, type ReactNode } from "react";

import RoleGuard from "@/components/auth/RoleGuard";
import {
  hasSuspensionAppealSession,
  SUSPENSION_APPEAL_SESSION_INVALIDATED_EVENT,
} from "@/lib/auth/suspensionAppealSession";
import type { AuthRole } from "@/lib/auth/role";

interface InquiryAccessGuardProps {
  allowedRole: readonly AuthRole[];
  children: ReactNode;
  unauthenticatedFallback: ReactNode;
}

/**
 * 문의 화면 접근 판단 상태
 *
 * CHECKING: 아직 sessionStorage 확인 전
 * APPEAL: 제한 세션 표시가 있어 문의 화면 사용
 * INVALIDATED: API 인증 실패로 제한 세션이 무효화됨 → 안내 화면 표시
 * DEFAULT: 재헌 새션 표사거 없어 기존 RoleGuard에 판단 위임
 */
type InquiryAccessState = "CHECKING" | "APPEAL" | "INVALIDATED" | "DEFAULT";

/** 일반 로그인 또는 정지 이의 제기 제한 세션에만 문의 화면을 허용한다. */
const InquiryAccessGuard = ({
  allowedRole,
  children,
  unauthenticatedFallback,
}: InquiryAccessGuardProps) => {
  const [accessState, setAccessState] = useState<InquiryAccessState>("CHECKING");

  useEffect(() => {
    // 초기 sessionStorage 확인보다 먼저 무효화된 제한 세션 상태를 덮어쓰지 않는다.
    const timerId = window.setTimeout(() => {
      setAccessState((currentState) =>
        currentState === "INVALIDATED"
          ? currentState
          : hasSuspensionAppealSession()
            ? "APPEAL"
            : "DEFAULT",
      );
    }, 0);

    const handleSessionInvalidated = () => {
      setAccessState("INVALIDATED");
    };

    window.addEventListener(SUSPENSION_APPEAL_SESSION_INVALIDATED_EVENT, handleSessionInvalidated);

    return () => {
      window.clearTimeout(timerId);
      window.removeEventListener(
        SUSPENSION_APPEAL_SESSION_INVALIDATED_EVENT,
        handleSessionInvalidated,
      );
    };
  }, []);

  if (accessState === "CHECKING") {
    return null;
  }

  if (accessState === "INVALIDATED") {
    return unauthenticatedFallback;
  }

  if (accessState === "APPEAL") {
    // 실제 제한 세션 유효성은 문의 API의 HttpOnly Cookie 인증에서 서버가 검증한다.
    return children;
  }

  return (
    <RoleGuard allowedRole={allowedRole} unauthenticatedFallback={unauthenticatedFallback}>
      {children}
    </RoleGuard>
  );
};

export default InquiryAccessGuard;
