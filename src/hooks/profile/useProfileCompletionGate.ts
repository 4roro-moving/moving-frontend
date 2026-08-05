"use client";

import { usePathname } from "next/navigation";

import { useCustomerProfileStatus } from "@/hooks/profile/useCustomerProfileStatus";
import { useMoverProfileStatus } from "@/hooks/profile/useMoverProfileStatus";
import { getProfilePath, type AuthAudience } from "@/lib/auth/redirect";
import type { AuthRole } from "@/lib/auth/role";
import { APP_ROUTES } from "@/lib/constants/appRoutes";
import { useAuthStore } from "@/stores/useAuthStore";

const isProfileCreatePath = (pathname: string, role: AuthRole | null): boolean => {
  if (role === "MOVER") {
    return pathname === APP_ROUTES.MOVER_PROFILE;
  }

  if (role === "CUSTOMER") {
    return pathname === APP_ROUTES.PROFILE;
  }

  return false;
};

interface ProfileCompletionGate {
  /** 프로필 생성 화면에서 GNB/SideNav 링크 숨김 */
  shouldHideNavLinks: boolean;
  /** 생성 외 화면에서 GNB/SideNav 클릭 가로채기 */
  shouldInterceptNav: boolean;
  /** 프로필 드롭다운 링크 가로채기 (생성 화면 포함) */
  shouldInterceptProfileMenu: boolean;
  profileCreatePath: string;
}

/**
 * 프로필 미완료 시 Header 가드.
 * status 조회 실패·로딩(null)은 fail-open — 가드하지 않음.
 */
export const useProfileCompletionGate = (role: AuthRole | null): ProfileCompletionGate => {
  const pathname = usePathname();
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);

  const isCustomer = isAuthenticated && role === "CUSTOMER";
  const isMover = isAuthenticated && role === "MOVER";

  const customerStatus = useCustomerProfileStatus(isCustomer);
  const moverStatus = useMoverProfileStatus(isMover);
  const statusQuery = isMover ? moverStatus : customerStatus;

  // fail-open: data가 없거나 오류면 완료로 간주하지 않고, 가드도 적용하지 않음
  const isIncomplete = statusQuery.data?.isProfileCompleted === false;
  const onCreatePath = isProfileCreatePath(pathname, role);
  const audience: AuthAudience = role === "MOVER" ? "mover" : "customer";

  return {
    shouldHideNavLinks: onCreatePath && isIncomplete,
    shouldInterceptNav: !onCreatePath && isIncomplete,
    shouldInterceptProfileMenu: isIncomplete,
    profileCreatePath: getProfilePath(audience),
  };
};
