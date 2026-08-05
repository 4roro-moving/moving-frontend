"use client";

import { usePathname } from "next/navigation";
import { type ReactNode } from "react";

import ProfileRequiredModal from "@/components/profile/ProfileRequiredModal";
import { useProfileCompletionState } from "@/hooks/profile/useProfileCompletionState";
import { isProfileCreatePath } from "@/lib/auth/redirect";
import { useAuthStore } from "@/stores/useAuthStore";

interface ProfileCompletionGuardProps {
  children: ReactNode;
  loadingFallback?: ReactNode;
}

/**
 * 프로필 미완료 시 생성 페이지 외 보호 라우트 접근을 막습니다.
 * - allowlist: /profile, /mover/profile
 * - status 로딩: loadingFallback
 * - 프로필 없음(404 등): incomplete → ProfileRequiredModal (닫기 불가, CTA만)
 * - 그 외 status 실패: fail-open
 * - 공개 페이지에는 사용하지 않음
 */
const ProfileCompletionGuard = ({
  children,
  loadingFallback = null,
}: ProfileCompletionGuardProps) => {
  const pathname = usePathname();
  const role = useAuthStore((state) => state.user?.role);
  const { shouldCheck, isStatusPending, isIncomplete, profileCreatePath, audience } =
    useProfileCompletionState(role);

  if (!shouldCheck) {
    return children;
  }

  if (isStatusPending) {
    return loadingFallback;
  }

  if (!isIncomplete || isProfileCreatePath(pathname, audience)) {
    return children;
  }

  return (
    <>
      {loadingFallback}
      <ProfileRequiredModal open profileCreatePath={profileCreatePath} />
    </>
  );
};

export default ProfileCompletionGuard;
