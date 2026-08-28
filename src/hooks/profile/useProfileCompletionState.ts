"use client";

import { useCustomerProfileStatus } from "@/hooks/profile/useCustomerProfileStatus";
import { useMoverProfileStatus } from "@/hooks/profile/useMoverProfileStatus";
import { loadProfileCompleted } from "@/lib/auth/profileCompleted";
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
 * - profileCompleted 쿠키 true: status 생략, 완료로 간주 (Soft UX)
 * - 쿠키 false: pending·checkAuth 중이어도 미완료 낙관 (빈 GNB)
 * - 힌트 없음 + status 전: fail-open
 */
export const useProfileCompletionState = (
  role: AuthRole | null | undefined,
  initialProfileCompleted: boolean | null = null,
): ProfileCompletionState => {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const hasHydrated = useAuthStore((state) => state.hasHydrated);
  const isCheckingAuth = useAuthStore((state) => state.isCheckingAuth);

  const isCustomerRole = role === "CUSTOMER";
  const isMoverRole = role === "MOVER";
  const hasProfileAudience = isCustomerRole || isMoverRole;

  const shouldCheck = isAuthenticated && hasProfileAudience;

  const hint = loadProfileCompleted() ?? initialProfileCompleted;
  /** 완료 힌트면 status 생략 (/me 는 checkAuth에서 유지) */
  const shouldFetchStatus = shouldCheck && hint !== true;

  const customerStatus = useCustomerProfileStatus(isCustomerRole && shouldFetchStatus);
  const moverStatus = useMoverProfileStatus(isMoverRole && shouldFetchStatus);
  const statusQuery = isMoverRole ? moverStatus : customerStatus;
  const audience = getAuthAudienceFromRole(role);

  const isAuthPending = !hasHydrated || isCheckingAuth;
  const isStatusPending = shouldFetchStatus && statusQuery.isPending;
  const hasNoRole = isAuthenticated && role == null;
  const isCompletionUnresolved = isAuthPending || isStatusPending || hasNoRole;

  const isIncompleteFromStatus = isProfileIncomplete({
    data: statusQuery.data,
    isError: statusQuery.isError,
    error: statusQuery.error,
  });

  const resolveIsIncomplete = (): boolean => {
    // audience 없음 / 완료 힌트 → 미완료 아님
    if (!hasProfileAudience || hint === true) {
      return false;
    }
    // status 확정(성공 fetch 또는 error) → status 기준
    if (statusQuery.isFetched || statusQuery.isError) {
      return isIncompleteFromStatus;
    }
    // status 전: 쿠키 false면 낙관적 미완료, 힌트 없으면 fail-open
    return hint === false;
  };

  const isIncomplete = resolveIsIncomplete();

  return {
    shouldCheck,
    isStatusPending,
    isCompletionUnresolved,
    isIncomplete,
    profileCreatePath: getProfilePath(audience),
    audience,
  };
};
