"use client";

import { useAuthStore } from "@/stores/useAuthStore";

export function useAdminAuthReady() {
  const hasHydrated = useAuthStore((state) => state.hasHydrated);
  const isCheckingAuth = useAuthStore((state) => state.isCheckingAuth);
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const user = useAuthStore((state) => state.user);

  const isPending = !hasHydrated || isCheckingAuth;
  const isAdmin = user?.role === "ADMIN";
  const canFetch = !isPending && isAuthenticated && isAdmin;

  return {
    isPending,
    isAdmin,
    canFetch,
  };
}
