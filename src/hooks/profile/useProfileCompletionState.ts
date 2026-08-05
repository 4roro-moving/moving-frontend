"use client";

import { useCustomerProfileStatus } from "@/hooks/profile/useCustomerProfileStatus";
import { useMoverProfileStatus } from "@/hooks/profile/useMoverProfileStatus";
import { getAuthAudienceFromRole, getProfilePath, type AuthAudience } from "@/lib/auth/redirect";
import type { AuthRole } from "@/lib/auth/role";
import { isProfileIncomplete } from "@/lib/profile/isProfileIncomplete";
import { useAuthStore } from "@/stores/useAuthStore";

interface ProfileCompletionState {
  shouldCheck: boolean;
  isStatusPending: boolean;
  /** hydrate·checkAuth·status 조회가 끝나기 전 — 완료 여부 미확정 */
  isCompletionUnresolved: boolean;
  isIncomplete: boolean;
  profileCreatePath: string;
  audience: AuthAudience;
}

/**
 * 프로필 완료 여부·생성 경로 (Header Gate / Route Guard 공용)
 * - status 로딩·일반 오류: isIncomplete=false (fail-open)
 * - isCompletionUnresolved: Header에서 완료 메뉴/링크 깜빡임 방지용
 */
export const useProfileCompletionState = (
  role: AuthRole | null | undefined,
): ProfileCompletionState => {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const hasHydrated = useAuthStore((state) => state.hasHydrated);
  const isCheckingAuth = useAuthStore((state) => state.isCheckingAuth);

  const isCustomer = isAuthenticated && role === "CUSTOMER";
  const isMover = isAuthenticated && role === "MOVER";
  const shouldCheck = isCustomer || isMover;

  const customerStatus = useCustomerProfileStatus(isCustomer);
  const moverStatus = useMoverProfileStatus(isMover);
  const statusQuery = isMover ? moverStatus : customerStatus;
  const audience = getAuthAudienceFromRole(role);

  const isAuthPending = !hasHydrated || isCheckingAuth;
  const isStatusPending = shouldCheck && statusQuery.isPending;
  const isCompletionUnresolved = isAuthPending || isStatusPending;

  return {
    shouldCheck,
    isStatusPending,
    isCompletionUnresolved,
    isIncomplete: isProfileIncomplete({
      data: statusQuery.data,
      isError: statusQuery.isError,
      error: statusQuery.error,
    }),
    profileCreatePath: getProfilePath(audience),
    audience,
  };
};
