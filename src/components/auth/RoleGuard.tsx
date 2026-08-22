"use client";

import { useEffect, useMemo, type ReactNode } from "react";
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
  allowedRole: AuthRole | readonly AuthRole[];
  children: ReactNode;
  loadingFallback?: ReactNode;
  unauthenticatedFallback?: ReactNode;
}

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

const isRoleAllowed = (
  role: AuthRole | null | undefined,
  allowedRoles: readonly AuthRole[],
): boolean => Boolean(role && allowedRoles.includes(role));

const RoleGuard = ({
  allowedRole,
  children,
  loadingFallback = null,
  unauthenticatedFallback,
}: RoleGuardProps) => {
  const router = useRouter();
  const pathname = usePathname();

  const hasHydrated = useAuthStore((state) => state.hasHydrated);
  const isCheckingAuth = useAuthStore((state) => state.isCheckingAuth);
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const storeRole = useAuthStore((state) => state.user?.role);

  const allowedRoles = useMemo(
    () => normalizeAllowedRoles(allowedRole as AuthRole[]),
    [allowedRole],
  );

  const knownRole = resolveKnownRole(storeRole);

  const isWrongRole = Boolean(knownRole && !isRoleAllowed(knownRole, allowedRoles));

  const isMultiRole = allowedRoles.length > 1;

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
      if (isMultiRole && unauthenticatedFallback) {
        return;
      }

      const singleAllowedRole = allowedRoles[0];

      if (!singleAllowedRole) {
        return;
      }

      const audience: AuthAudience = getAuthAudienceFromRole(singleAllowedRole);

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
    isMultiRole,
    unauthenticatedFallback,
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

  if (!isAuthenticated) {
    return unauthenticatedFallback ?? null;
  }

  if (!isRoleAllowed(storeRole, allowedRoles)) {
    return null;
  }

  return children;
};

export default RoleGuard;
