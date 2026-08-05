"use client";

import { usePathname, useRouter } from "next/navigation";
import { type ReactNode } from "react";

import ProfileRequiredModal from "@/components/profile/ProfileRequiredModal";
import { useCustomerProfileStatus } from "@/hooks/profile/useCustomerProfileStatus";
import { useMoverProfileStatus } from "@/hooks/profile/useMoverProfileStatus";
import { getProfilePath, getRoleHomePath, type AuthAudience } from "@/lib/auth/redirect";
import { isProfileMissingError } from "@/lib/profile/isProfileMissingError";
import { useAuthStore } from "@/stores/useAuthStore";

interface ProfileCompletionGuardProps {
  children: ReactNode;
  loadingFallback?: ReactNode;
}

const isProfileCreatePath = (pathname: string, audience: AuthAudience): boolean => {
  return pathname === getProfilePath(audience);
};

/**
 * 프로필 미완료 시 생성 페이지 외 보호 라우트 접근을 막습니다.
 * - allowlist: /profile, /mover/profile
 * - status 로딩: loadingFallback
 * - 프로필 없음(404 등): incomplete → ProfileRequiredModal
 *   · CTA: 생성 경로 / 닫기: same-origin back 또는 역할 홈
 * - 그 외 status 실패: fail-open
 * - 공개 페이지에는 사용하지 않음
 */
const ProfileCompletionGuard = ({
  children,
  loadingFallback = null,
}: ProfileCompletionGuardProps) => {
  const router = useRouter();
  const pathname = usePathname();
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const role = useAuthStore((state) => state.user?.role);

  const isCustomer = isAuthenticated && role === "CUSTOMER";
  const isMover = isAuthenticated && role === "MOVER";
  const audience: AuthAudience = isMover ? "mover" : "customer";

  const customerStatus = useCustomerProfileStatus(isCustomer);
  const moverStatus = useMoverProfileStatus(isMover);
  const statusQuery = isMover ? moverStatus : customerStatus;

  const shouldCheck = isCustomer || isMover;
  const isStatusPending = shouldCheck && statusQuery.isPending;
  const isIncomplete =
    statusQuery.data?.isProfileCompleted === false ||
    (statusQuery.isError && isProfileMissingError(statusQuery.error));
  const onCreatePath = isProfileCreatePath(pathname, audience);
  const profileCreatePath = getProfilePath(audience);

  const leaveIncompletePage = () => {
    const canGoBack = (() => {
      if (typeof document === "undefined") return false;
      if (!document.referrer) return false;
      try {
        return new URL(document.referrer).origin === window.location.origin;
      } catch {
        return false;
      }
    })();

    if (canGoBack) {
      router.back();
      return;
    }

    router.replace(getRoleHomePath(role));
  };

  if (!shouldCheck) {
    return children;
  }

  if (isStatusPending) {
    return loadingFallback;
  }

  if (isIncomplete && !onCreatePath) {
    return (
      <>
        {loadingFallback}
        <ProfileRequiredModal
          open
          onClose={leaveIncompletePage}
          profileCreatePath={profileCreatePath}
        />
      </>
    );
  }

  return children;
};

export default ProfileCompletionGuard;
