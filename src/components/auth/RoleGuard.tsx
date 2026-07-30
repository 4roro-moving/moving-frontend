"use client";

import { useEffect, type ReactNode } from "react";
import { usePathname, useRouter } from "next/navigation";

import { buildLoginPath, getRoleHomePath, type AuthAudience } from "@/lib/auth/redirect";
import type { AuthRole } from "@/lib/auth/role";
import { useAuthStore } from "@/stores/useAuthStore";

interface RoleGuardProps {
  allowedRole: Extract<AuthRole, "CUSTOMER" | "MOVER">;
  children: ReactNode;
}

/**
 * 역할 전용 페이지 가드 — (protected) layout에서 사용
 */
const RoleGuard = ({ allowedRole, children }: RoleGuardProps) => {
  const router = useRouter();
  const pathname = usePathname();
  const hasHydrated = useAuthStore((state) => state.hasHydrated);
  const isCheckingAuth = useAuthStore((state) => state.isCheckingAuth);
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const role = useAuthStore((state) => state.user?.role);

  useEffect(() => {
    if (!hasHydrated || isCheckingAuth) return;

    const audience: AuthAudience = allowedRole === "MOVER" ? "mover" : "customer";

    if (!isAuthenticated) {
      router.replace(buildLoginPath(`${pathname}${window.location.search}`, audience));
      return;
    }

    if (role && role !== allowedRole) {
      router.replace(getRoleHomePath(role));
    }
  }, [hasHydrated, isCheckingAuth, isAuthenticated, role, allowedRole, pathname, router]);

  if (!hasHydrated || isCheckingAuth) {
    return null;
  }

  if (!isAuthenticated || role !== allowedRole) {
    return null;
  }

  return children;
};

export default RoleGuard;
