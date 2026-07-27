"use client";

import { useEffect, useLayoutEffect } from "react";

import { buildLoginPath } from "@/lib/auth/redirect";
import { APP_ROUTES } from "@/lib/constants/appRoutes";
import { useAuthStore } from "@/stores/useAuthStore";

/**
 * 앱 시작 시 세션 확인 + access 만료(auth:expired) 시 로그인으로 유도
 */
export const useAuthInit = () => {
  const hydrateFromStorage = useAuthStore((state) => state.hydrateFromStorage);
  const checkAuth = useAuthStore((state) => state.checkAuth);
  const clearSession = useAuthStore((state) => state.clearSession);

  // paint 전에 storage hydrate → Header 깜빡임·hydration mismatch 방지
  useLayoutEffect(() => {
    hydrateFromStorage();
  }, [hydrateFromStorage]);

  useEffect(() => {
    void checkAuth();
  }, [checkAuth]);

  useEffect(() => {
    const handleExpired = () => {
      clearSession();

      const { pathname, search } = window.location;
      const isAuthPage = [APP_ROUTES.LOGIN, APP_ROUTES.SIGN_UP, APP_ROUTES.MOVER_LOGIN].some(
        (path) => pathname === path || pathname.startsWith(`${path}/`),
      );
      if (isAuthPage) return;

      window.location.assign(buildLoginPath(`${pathname}${search}`));
    };

    window.addEventListener("auth:expired", handleExpired);
    return () => window.removeEventListener("auth:expired", handleExpired);
  }, [clearSession]);
};
