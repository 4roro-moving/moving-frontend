"use client";

import { useProfileCompletionState } from "@/hooks/profile/useProfileCompletionState";
import type { AuthRole } from "@/lib/auth/role";

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
  const { isIncomplete, profileCreatePath } = useProfileCompletionState(role);

  return {
    shouldHideNavLinks: isIncomplete,
    profileCreatePath,
  };
};
