"use client";

import { useEffect, type ReactNode } from "react";
import { usePathname, useRouter } from "next/navigation";

import { getAccessTokenRole } from "@/lib/auth/accessTokenPayload";
import { buildLoginPath, getRoleHomePath, type AuthAudience } from "@/lib/auth/redirect";
import { loadRole, type AuthRole } from "@/lib/auth/role";
import { getAccessToken } from "@/lib/auth/token";
import { useAuthStore } from "@/stores/useAuthStore";

interface RoleGuardProps {
  allowedRole: Extract<AuthRole, "CUSTOMER" | "MOVER">;
  children: ReactNode;
}

const resolveKnownRole = (storeRole: AuthRole | null | undefined): AuthRole | null => {
  const token = getAccessToken();
  return storeRole ?? loadRole() ?? (token ? getAccessTokenRole(token) : null);
};

/**
 * 역할 전용 페이지 가드 — (protected) layout에서 사용
 * known role이 불일치하면 checkAuth 대기 없이 역할 홈으로 이동
 */
const RoleGuard = ({ allowedRole, children }: RoleGuardProps) => {
  const router = useRouter();
  const pathname = usePathname();
  const hasHydrated = useAuthStore((state) => state.hasHydrated);
  const isCheckingAuth = useAuthStore((state) => state.isCheckingAuth);
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const storeRole = useAuthStore((state) => state.user?.role);

  const knownRole = resolveKnownRole(storeRole);
  const isWrongRole = Boolean(knownRole && knownRole !== allowedRole);

  useEffect(() => {
    if (!hasHydrated) return;

    if (isWrongRole && knownRole) {
      router.replace(getRoleHomePath(knownRole));
      return;
    }

    if (isCheckingAuth) return;

    const audience: AuthAudience = allowedRole === "MOVER" ? "mover" : "customer";

    if (!isAuthenticated) {
      router.replace(buildLoginPath(`${pathname}${window.location.search}`, audience));
      return;
    }

    if (storeRole && storeRole !== allowedRole) {
      router.replace(getRoleHomePath(storeRole));
    }
  }, [
    hasHydrated,
    isCheckingAuth,
    isAuthenticated,
    isWrongRole,
    knownRole,
    storeRole,
    allowedRole,
    pathname,
    router,
  ]);

  if (!hasHydrated) {
    return null;
  }

  if (isWrongRole) {
    return null;
  }

  if (isCheckingAuth) {
    return null;
  }

  if (!isAuthenticated || storeRole !== allowedRole) {
    return null;
  }

  return children;
};

export default RoleGuard;
