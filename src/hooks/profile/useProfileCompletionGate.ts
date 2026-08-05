"use client";

import { useCustomerProfileStatus } from "@/hooks/profile/useCustomerProfileStatus";
import { useMoverProfileStatus } from "@/hooks/profile/useMoverProfileStatus";
import { getProfilePath, type AuthAudience } from "@/lib/auth/redirect";
import type { AuthRole } from "@/lib/auth/role";
import { isProfileMissingError } from "@/lib/profile/isProfileMissingError";
import { useAuthStore } from "@/stores/useAuthStore";

interface ProfileCompletionGate {
  /** 프로필 미완료 시 GNB/SideNav 링크 숨김 (경로 무관) */
  shouldHideNavLinks: boolean;
  profileCreatePath: string;
}

/**
 * 프로필 미완료 시 Header 가드.
 * - isProfileCompleted === false → incomplete
 * - status가 프로필 없음(404 등) → incomplete
 * - 그 외 status 실패·로딩 → fail-open
 */
export const useProfileCompletionGate = (role: AuthRole | null): ProfileCompletionGate => {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);

  const isCustomer = isAuthenticated && role === "CUSTOMER";
  const isMover = isAuthenticated && role === "MOVER";

  const customerStatus = useCustomerProfileStatus(isCustomer);
  const moverStatus = useMoverProfileStatus(isMover);
  const statusQuery = isMover ? moverStatus : customerStatus;

  const isIncomplete =
    statusQuery.data?.isProfileCompleted === false ||
    (statusQuery.isError && isProfileMissingError(statusQuery.error));

  const audience: AuthAudience = role === "MOVER" ? "mover" : "customer";

  return {
    shouldHideNavLinks: isIncomplete,
    profileCreatePath: getProfilePath(audience),
  };
};
