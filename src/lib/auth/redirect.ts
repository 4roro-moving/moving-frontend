import { getCustomerProfileStatus } from "@/lib/api/profile";
import { APP_ROUTES } from "@/lib/constants/appRoutes";

const AUTH_PATH_PREFIXES = [
  APP_ROUTES.LOGIN,
  APP_ROUTES.SIGN_UP,
  APP_ROUTES.MOVER_LOGIN,
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

  return getSafeReturnPath(params.returnPath) ?? APP_ROUTES.MOVERS.ROOT;
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
  returnPath?: string | null;
  fallbackPath?: string;
}): Promise<string> => {
  const fallbackPath = params?.fallbackPath ?? APP_ROUTES.PROFILE;

  try {
    const status = await getCustomerProfileStatus();
    return resolvePostLoginPath({
      isProfileCompleted: status.isProfileCompleted,
      returnPath: params?.returnPath,
    });
  } catch {
    return fallbackPath;
  }
};

/** 토큰 만료 등으로 로그인 페이지로 보낼 때 */
export const buildLoginPath = (returnPath?: string): string => {
  const safe = getSafeReturnPath(returnPath);
  if (!safe) return APP_ROUTES.LOGIN;
  return `${APP_ROUTES.LOGIN}?redirect=${encodeURIComponent(safe)}`;
};
