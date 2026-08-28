"use client";

import { useTranslations } from "next-intl";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, type ReactNode } from "react";

import ProfileCompletionGuard from "@/components/auth/ProfileCompletionGuard";
import EstimatesQueryStatus from "@/components/estimate/EstimatesQueryStatus";
import { useCustomerAuthReady } from "@/hooks/useCustomerAuthReady";
import { buildLoginPath, getRoleHomePath } from "@/lib/auth/redirect";

interface CustomerAuthGateProps {
  children: ReactNode;
  /** 세션 확인 중 표시. 기본은 공통 로딩 메시지 */
  loadingMessage?: string;
  /** 세션 확인 중 커스텀 UI. 있으면 loadingMessage 대신 사용 */
  loadingFallback?: ReactNode;
}

/**
 * 고객 전용 영역 가드
 * - 세션 복구 중: 로딩
 * - 비로그인: 로그인 페이지로 이동 (?redirect=)
 * - CUSTOMER 아님(기사님·ADMIN·역할 미확정): getRoleHomePath로 이동
 * - 프로필 미완료: ProfileCompletionGuard (모달)
 *
 * `(customer)/(protected)` layout 밖 페이지에서만 사용한다.
 * layout 안에서는 RoleGuard + layout의 ProfileCompletionGuard만 쓰고,
 * 이 Gate를 겹쳐 두지 않는다.
 *
 * // 2026.07.30 정슬기 - [추가]
 * // 2026.07.30 정슬기 - [수정] 리다이렉트를 router.replace로 통일 (하드 새로고침 불필요)
 * // 2026.08.03 정슬기 - [수정] CUSTOMER 명시 판별로 canFetch·비고객 리다이렉트
 *
 * ADMIN 홈 경로는 getRoleHomePath의 임시 정책(기사님 찾기)을 그대로 사용합니다.
 * 관리자 전용 홈이 정해지면 팀 정책에 맞춰 redirect 쪽만 조정하면 됩니다.
 */
export default function CustomerAuthGate({
  children,
  loadingMessage,
  loadingFallback,
}: CustomerAuthGateProps) {
  const t = useTranslations("auth");
  const router = useRouter();
  const pathname = usePathname();
  const { isPending, isAuthenticated, isCustomer, canFetch, user } = useCustomerAuthReady();

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

    if (!isCustomer) {
      router.replace(getRoleHomePath(user?.role));
    }
  }, [isPending, isAuthenticated, isCustomer, user?.role, pathname, router]);

  const resolvedLoadingFallback = loadingFallback ?? (
    <EstimatesQueryStatus message={loadingMessage ?? t("checkingLoginStatus")} />
  );

  if (isPending) {
    return resolvedLoadingFallback;
  }

  if (!isAuthenticated || !isCustomer || !canFetch) {
    return null;
  }

  return (
    <ProfileCompletionGuard loadingFallback={resolvedLoadingFallback}>
      {children}
    </ProfileCompletionGuard>
  );
}
