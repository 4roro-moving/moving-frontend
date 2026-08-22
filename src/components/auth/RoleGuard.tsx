"use client";

import { useEffect, type ReactNode } from "react";
import { usePathname, useRouter } from "next/navigation";

import { getAccessTokenRole } from "@/lib/auth/accessTokenPayload";
import {
  buildLoginPath,
  getAuthAudienceFromRole,
  getRoleHomePath,
  type AuthAudience,
} from "@/lib/auth/redirect";
import type { AuthRole } from "@/lib/auth/role";
import { getAccessToken } from "@/lib/auth/token";
import { useAuthStore } from "@/stores/useAuthStore";

interface RoleGuardProps {
  allowedRole: AuthRole | AuthRole[];
  children: ReactNode;
  loadingFallback?: ReactNode;
}

/**
 * early direct role 이 있으면 바로 return
 *
 * token 이 없으면 null return
 * token 이 있으면 token 에서 role 을 추출하여 return
 */
const resolveKnownRole = (storeRole: AuthRole | null | undefined): AuthRole | null => {
  if (storeRole) {
    return storeRole;
  }

  const token = getAccessToken();

  if (!token) {
    return null;
  }

  return getAccessTokenRole(token);
};

const normalizeAllowedRoles = (allowedRole: AuthRole | AuthRole[]): AuthRole[] =>
  Array.isArray(allowedRole) ? allowedRole : [allowedRole];

const isRoleAllowed = (role: AuthRole | null | undefined, allowedRoles: AuthRole[]): boolean =>
  Boolean(role && allowedRoles.includes(role));

/**
 * 역할 전용 페이지 가드 — (protected) layout에서 사용
 *
 * 단일 역할 또는 여러 역할을 허용할 수 있습니다.
 * known role이 허용 역할에 포함되지 않으면 checkAuth 대기 없이 역할 홈으로 이동합니다.
 */
const RoleGuard = ({ allowedRole, children, loadingFallback = null }: RoleGuardProps) => {
  const router = useRouter();
  const pathname = usePathname();

  const hasHydrated = useAuthStore((state) => state.hasHydrated);
  const isCheckingAuth = useAuthStore((state) => state.isCheckingAuth);
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const storeRole = useAuthStore((state) => state.user?.role);

  const allowedRoles = normalizeAllowedRoles(allowedRole);

  const knownRole = resolveKnownRole(storeRole);

  const isWrongRole = Boolean(knownRole && !isRoleAllowed(knownRole, allowedRoles));

  useEffect(() => {
    if (!hasHydrated) {
      return;
    }

    if (isWrongRole && knownRole) {
      router.replace(getRoleHomePath(knownRole));
      return;
    }

    if (isCheckingAuth) {
      return;
    }

    if (!isAuthenticated) {
      const loginAudienceRole = allowedRoles[0];

      if (!loginAudienceRole) {
        return;
      }

      const audience: AuthAudience = getAuthAudienceFromRole(loginAudienceRole);

      router.replace(buildLoginPath(`${pathname}${window.location.search}`, audience));
      return;
    }

    if (storeRole && !isRoleAllowed(storeRole, allowedRoles)) {
      router.replace(getRoleHomePath(storeRole));
    }
  }, [
    hasHydrated,
    isCheckingAuth,
    isAuthenticated,
    isWrongRole,
    knownRole,
    storeRole,
    allowedRoles,
    pathname,
    router,
  ]);

  if (!hasHydrated) {
    return loadingFallback;
  }

  if (isWrongRole) {
    return null;
  }

  if (isCheckingAuth) {
    return loadingFallback;
  }

  if (!isAuthenticated || !isRoleAllowed(storeRole, allowedRoles)) {
    return null;
  }

  return children;
};

export default RoleGuard;
