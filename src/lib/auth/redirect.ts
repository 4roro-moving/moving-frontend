import { getCustomerProfileStatus, getMoverProfileStatus } from "@/lib/api/profile";
import type { AuthRole } from "@/lib/auth/role";
import { APP_ROUTES } from "@/lib/constants/appRoutes";

export type AuthAudience = "customer" | "mover";

const AUTH_PATH_PREFIXES = [
  APP_ROUTES.LOGIN,
  APP_ROUTES.SIGN_UP,
  APP_ROUTES.MOVER_LOGIN,
  APP_ROUTES.MOVER_SIGN_UP,
  APP_ROUTES.PROFILE,
  APP_ROUTES.MOVER_PROFILE,
] as const;

/** open redirect 방지 — 내부 경로만 허용 */
export const getSafeReturnPath = (candidate?: string | null): string | null => {
  if (!candidate || !candidate.startsWith("/") || candidate.startsWith("//")) {
    return null;
  }

  if (AUTH_PATH_PREFIXES.some((path) => candidate === path || candidate.startsWith(`${path}/`))) {
    return null;
  }

  return candidate;
};

export const getAuthAudienceFromRole = (role: AuthRole | null | undefined): AuthAudience => {
  return role === "MOVER" ? "mover" : "customer";
};

export const resolvePostLoginPath = (params: {
  isProfileCompleted: boolean;
  returnPath?: string | null;
  audience?: AuthAudience;
}): string => {
  const audience = params.audience ?? "customer";
  const incompleteProfilePath =
    audience === "mover" ? APP_ROUTES.MOVER_PROFILE : APP_ROUTES.PROFILE;
  const defaultHomePath = audience === "mover" ? APP_ROUTES.MOVER_PROFILE : APP_ROUTES.MOVERS.ROOT;

  if (!params.isProfileCompleted) {
    return incompleteProfilePath;
  }

  return getSafeReturnPath(params.returnPath) ?? defaultHomePath;
};

/** 로그인 페이지 ?redirect= 쿼리 */
export const getLoginRedirectParam = (): string | null => {
  if (typeof window === "undefined") return null;
  return new URLSearchParams(window.location.search).get("redirect");
};

/**
 * 인증 성공 후 이동 경로.
 * 프로필 상태 조회 실패 시 fallbackPath 사용.
 */
export const getPostAuthRedirectPath = async (params?: {
  audience?: AuthAudience;
  returnPath?: string | null;
  fallbackPath?: string;
}): Promise<string> => {
  const audience = params?.audience ?? "customer";
  const fallbackPath =
    params?.fallbackPath ?? (audience === "mover" ? APP_ROUTES.MOVER_PROFILE : APP_ROUTES.PROFILE);

  try {
    const status =
      audience === "mover" ? await getMoverProfileStatus() : await getCustomerProfileStatus();

    return resolvePostLoginPath({
      isProfileCompleted: status.isProfileCompleted,
      returnPath: params?.returnPath,
      audience,
    });
  } catch {
    return fallbackPath;
  }
};

/** 토큰 만료 등으로 로그인 페이지로 보낼 때 */
export const buildLoginPath = (
  returnPath?: string,
  audience: AuthAudience = "customer",
): string => {
  const base = audience === "mover" ? APP_ROUTES.MOVER_LOGIN : APP_ROUTES.LOGIN;
  const safe = getSafeReturnPath(returnPath);
  if (!safe) return base;
  return `${base}?redirect=${encodeURIComponent(safe)}`;
};

export const isAuthPagePath = (pathname: string): boolean => {
  return [
    APP_ROUTES.LOGIN,
    APP_ROUTES.SIGN_UP,
    APP_ROUTES.MOVER_LOGIN,
    APP_ROUTES.MOVER_SIGN_UP,
  ].some((path) => pathname === path || pathname.startsWith(`${path}/`));
};

export const getAudienceFromPathname = (pathname: string): AuthAudience => {
  return pathname === APP_ROUTES.MOVER_LOGIN ||
    pathname.startsWith(`${APP_ROUTES.MOVER_LOGIN}/`) ||
    pathname === APP_ROUTES.MOVER_SIGN_UP ||
    pathname.startsWith(`${APP_ROUTES.MOVER_SIGN_UP}/`) ||
    pathname.startsWith("/mover/")
    ? "mover"
    : "customer";
};
