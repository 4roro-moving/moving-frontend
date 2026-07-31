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
  const markUnauthenticated = useAuthStore((state) => state.markUnauthenticated);

  useLayoutEffect(() => {
    hydrateFromStorage();
  }, [hydrateFromStorage]);

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  useEffect(() => {
    const handleExpired = () => {
      // cookie·storage hard clear는 logout만 — 여기선 메모리 상태만 정리
      markUnauthenticated();

      const { pathname, search } = window.location;
      const isAuthPage = [APP_ROUTES.LOGIN, APP_ROUTES.SIGN_UP, APP_ROUTES.MOVER_LOGIN].some(
        (path) => pathname === path || pathname.startsWith(`${path}/`),
      );
      if (isAuthPage) return;

      // 404 화면은 버튼 클릭 전까지 유지 (로그인으로 강제 이동하지 않음)
      // // 2026.07.31 정슬기 - [수정]
      if (document.querySelector("[data-not-found-page]")) return;

      window.location.assign(buildLoginPath(`${pathname}${search}`));
    };

    window.addEventListener("auth:expired", handleExpired);
    return () => window.removeEventListener("auth:expired", handleExpired);
  }, [markUnauthenticated]);
};
