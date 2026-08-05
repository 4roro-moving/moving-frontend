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
  isIncomplete: boolean;
  profileCreatePath: string;
  audience: AuthAudience;
}

/**
 * 프로필 완료 여부·생성 경로 (Header Gate / Route Guard 공용)
 * - status 로딩·일반 오류: isIncomplete=false (fail-open)
 */
export const useProfileCompletionState = (
  role: AuthRole | null | undefined,
): ProfileCompletionState => {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);

  const isCustomer = isAuthenticated && role === "CUSTOMER";
  const isMover = isAuthenticated && role === "MOVER";
  const shouldCheck = isCustomer || isMover;

  const customerStatus = useCustomerProfileStatus(isCustomer);
  const moverStatus = useMoverProfileStatus(isMover);
  const statusQuery = isMover ? moverStatus : customerStatus;
  const audience = getAuthAudienceFromRole(role);

  return {
    shouldCheck,
    isStatusPending: shouldCheck && statusQuery.isPending,
    isIncomplete: isProfileIncomplete({
      data: statusQuery.data,
      isError: statusQuery.isError,
      error: statusQuery.error,
    }),
    profileCreatePath: getProfilePath(audience),
    audience,
  };
};
