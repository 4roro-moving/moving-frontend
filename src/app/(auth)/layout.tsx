import type { ReactNode } from "react";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";

import GuestOnly from "@/components/auth/GuestOnly";

import { ROLE_STORAGE_KEY, parseAuthRole } from "@/lib/auth/role";
import { safeDecodeCookieValue } from "@/lib/auth/nickname";
import { REFRESH_TOKEN_COOKIE_NAME } from "@/lib/auth/token";
import { APP_ROUTES } from "@/lib/constants/appRoutes";

interface AuthRouteLayoutProps {
  children: ReactNode;
}

const AuthRouteLayout = async ({ children }: AuthRouteLayoutProps) => {
  // 기사가 유저 페이지에 접근하거나 그 반대일 경우를 대비하기 위해 redirect 처리
  // refresh token 을 먼저 조회
  const cookieStore = await cookies();
  const hasSession = Boolean(cookieStore.get(REFRESH_TOKEN_COOKIE_NAME));

  // refresh token 이 있으면 초기 페이지로 넘김 (추후 권한이 없는 페이지 등 만들 수도 있음)
  if (hasSession) {
    const rawRole = cookieStore.get(ROLE_STORAGE_KEY)?.value;
    const role = parseAuthRole(rawRole ? safeDecodeCookieValue(rawRole) : null);
    redirect(role === "MOVER" ? APP_ROUTES.MOVER_ESTIMATES.ROOT : APP_ROUTES.ESTIMATES.ROOT);
  }

  return <GuestOnly>{children}</GuestOnly>;
};

export default AuthRouteLayout;
