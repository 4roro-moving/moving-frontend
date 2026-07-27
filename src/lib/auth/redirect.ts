import { APP_ROUTES } from "@/lib/constants/appRoutes";

const AUTH_PATH_PREFIXES = [
  APP_ROUTES.LOGIN,
  APP_ROUTES.SIGN_UP,
  APP_ROUTES.MOVER_LOGIN,
  APP_ROUTES.DEV_LOGIN,
  APP_ROUTES.PROFILE,
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

export const resolvePostLoginPath = (params: {
  isProfileCompleted: boolean;
  returnPath?: string | null;
}): string => {
  if (!params.isProfileCompleted) {
    return APP_ROUTES.PROFILE;
  }

  return getSafeReturnPath(params.returnPath) ?? APP_ROUTES.MOVERS;
};

/** 토큰 만료 등으로 로그인 페이지로 보낼 때 */
export const buildLoginPath = (returnPath?: string): string => {
  const safe = getSafeReturnPath(returnPath);
  if (!safe) return APP_ROUTES.LOGIN;
  return `${APP_ROUTES.LOGIN}?redirect=${encodeURIComponent(safe)}`;
};
