import { getCustomerProfileStatus, getMoverProfileStatus } from "@/lib/api/profile";
import { saveProfileCompleted } from "@/lib/auth/profileCompleted";
import type { AuthRole, LoginRole } from "@/lib/auth/role";
import { APP_ROUTES } from "@/lib/constants/appRoutes";
import { isMoverDetailId } from "@/lib/utils/isMoverDetailId";
import { ApiError } from "@/types/api";

export type AuthAudience = "customer" | "mover" | "admin";

/** 로그인 입구 audience → 요청 role. ADMIN 입구는 일반/소셜 로그인에 사용하지 않는다. */
export const audienceToLoginRole = (audience: AuthAudience): LoginRole => {
  if (audience === "admin") {
    throw new ApiError("관리자는 이 로그인 경로를 사용할 수 없습니다.");
  }

  return audience === "mover" ? "MOVER" : "CUSTOMER";
};

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
  // 기본 customer
  switch (role) {
    case "ADMIN":
      return "admin";
    case "MOVER":
      return "mover";
    case "CUSTOMER":
      return "customer";
    default:
      return "customer";
  }
};

/** 로그인/OAuth 입구 audience와 계정 role이 다를 때 안내 문구 */
export const getAudienceMismatchMessage = (
  pageAudience: AuthAudience,
  accountAudience: AuthAudience,
): string => {
  if (pageAudience === accountAudience) {
    return "올바르지 않은 계정입니다. 다시 로그인해 주세요.";
  }

  // 관리자 계정이 고객/기사 로그인을 할 경우
  if (accountAudience === "admin") {
    return "관리자 계정입니다. 관리자 전용 로그인을 이용해 주세요.";
  }

  // 관리자 로그인 페이지에 고객/기사가 들어온 경우
  if (pageAudience === "admin") {
    return accountAudience === "mover"
      ? "기사님 계정입니다. 기사님 전용 로그인을 이용해 주세요."
      : "일반 유저 계정입니다. 일반 유저 로그인을 이용해 주세요.";
  }

  // 고객 로그인 페이지에 기사가 들어온 경우
  if (pageAudience === "customer") {
    return "기사님 계정입니다. 기사님 전용 로그인을 이용해 주세요.";
  }
  return "일반 유저 계정입니다. 일반 유저 로그인을 이용해 주세요.";
};

/** 역할별 홈 — 잘못된 role 접근·auth 재진입 */
export const getRoleHomePath = (role: AuthRole | null | undefined): string => {
  // 기본 customer
  // admin home page 임시 설정. 추후 변경 필요
  switch (role) {
    case "ADMIN":
      return APP_ROUTES.MOVERS.ROOT;
    case "MOVER":
      return APP_ROUTES.MOVER_ESTIMATES.ROOT;
    case "CUSTOMER":
      return APP_ROUTES.MOVERS.ROOT;
    default:
      return APP_ROUTES.MOVERS.ROOT;
  }
};

export const getProfilePath = (audience: AuthAudience): string => {
  return audience === "mover" ? APP_ROUTES.MOVER_PROFILE : APP_ROUTES.PROFILE;
};

/** 역할별 프로필 생성(등록) 경로인지 */
export const isProfileCreatePath = (pathname: string, audience: AuthAudience): boolean => {
  return pathname === getProfilePath(audience);
};

export const resolvePostLoginPath = (params: {
  isProfileCompleted: boolean;
  returnPath?: string | null;
  audience?: AuthAudience;
}): string => {
  const audience = params.audience ?? "customer";

  if (!params.isProfileCompleted) {
    return getProfilePath(audience);
  }

  return (
    getSafeReturnPath(params.returnPath) ??
    getRoleHomePath(audience === "mover" ? "MOVER" : "CUSTOMER")
  );
};

/** 로그인 페이지 ?redirect= 쿼리 */
export const getLoginRedirectParam = (): string | null => {
  if (typeof window === "undefined") return null;
  return new URLSearchParams(window.location.search).get("redirect");
};

/**
 * login / signup 성공 후 전용.
 * 프로필 미완료일 때만 profile, 그 외·조회 실패 시 역할 홈.
 */
export const getPostAuthRedirectPath = async (params?: {
  audience?: AuthAudience;
  returnPath?: string | null;
  fallbackPath?: string;
}): Promise<string> => {
  const audience = params?.audience ?? "customer";
  const fallbackPath =
    params?.fallbackPath ?? getRoleHomePath(audience === "mover" ? "MOVER" : "CUSTOMER");

  try {
    // 로그인 직후 폐기된 refresh 쿠키로 /auth/refresh가 돌지 않도록
    const statusOptions = { skipRefresh: true } as const;
    const status =
      audience === "mover"
        ? await getMoverProfileStatus(statusOptions)
        : await getCustomerProfileStatus(statusOptions);

    saveProfileCompleted(status.isProfileCompleted);

    return resolvePostLoginPath({
      isProfileCompleted: status.isProfileCompleted,
      returnPath: params?.returnPath,
      audience,
    });
  } catch {
    return fallbackPath;
  }
};

/**
 * 이미 로그인된 채 auth 페이지 재진입용 동기 fallback (역할 홈).
 * 프로필 완료 여부가 필요하면 GuestOnly에서 getPostAuthRedirectPath를 사용한다.
 */
export const getAuthenticatedAuthPageRedirectPath = (role: AuthRole | null | undefined): string => {
  return getRoleHomePath(role);
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

/** OAuth Provider callback — checkAuth의 refresh/profile을 건너뜁니다. */
export const isOAuthCallbackPath = (pathname: string): boolean => {
  return (["google", "kakao", "naver"] as const).some(
    (provider) => pathname === APP_ROUTES.OAUTH_CALLBACK(provider),
  );
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

/**
 * 로그인 없이 접근 가능한 공개 페이지인지 판별합니다.
 * - 랜딩 `/`
 * - 기사님 찾기 `/movers`
 * - 기사님 상세 `/movers/:id` (유효한 id만)
 * // 2026.08.02 정슬기 - [수정] HOME 포함·isPublicPath로 정리 (auth:expired 랜딩 강제 로그인 방지)
 */
export const isPublicPath = (pathname: string): boolean => {
  if (pathname === APP_ROUTES.HOME) {
    return true;
  }

  if (pathname === APP_ROUTES.MOVERS.ROOT) {
    return true;
  }

  const detailPrefix = `${APP_ROUTES.MOVERS.ROOT}/`;

  if (!pathname.startsWith(detailPrefix)) {
    return false;
  }

  const moverId = pathname.slice(detailPrefix.length);

  return !moverId.includes("/") && isMoverDetailId(moverId);
};
