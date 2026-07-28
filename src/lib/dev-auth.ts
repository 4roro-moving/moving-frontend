/**
 * 개발 전용 임시 인증 유틸
 *
 * 실제 로그인 기능 PR이 병합되면 이 파일과 함께 아래를 삭제하세요.
 * - src/app/dev-login/page.tsx
 * - axiosInstance의 DEV Authorization / 401 인터셉터
 * - API_ROUTES.AUTH.LOGIN (또는 실제 auth 라우트로 교체)
 *
 * // 2026.07.24 정슬기 - [추가] 받은 견적 API 연동 확인용 개발 전용 인증
 */

const ACCESS_TOKEN_KEY = "dev.accessToken";
const REFRESH_TOKEN_KEY = "dev.refreshToken";

export interface DevAuthTokens {
  accessToken: string;
  refreshToken: string;
}

export function isDevAuthEnabled(): boolean {
  return process.env.NODE_ENV === "development";
}

export function getDevAccessToken(): string | null {
  if (!isDevAuthEnabled() || typeof window === "undefined") {
    return null;
  }

  return sessionStorage.getItem(ACCESS_TOKEN_KEY);
}

export function getDevRefreshToken(): string | null {
  if (!isDevAuthEnabled() || typeof window === "undefined") {
    return null;
  }

  return sessionStorage.getItem(REFRESH_TOKEN_KEY);
}

export function setDevAuthTokens(tokens: DevAuthTokens): void {
  if (!isDevAuthEnabled() || typeof window === "undefined") {
    return;
  }

  sessionStorage.setItem(ACCESS_TOKEN_KEY, tokens.accessToken);
  sessionStorage.setItem(REFRESH_TOKEN_KEY, tokens.refreshToken);
  // 동적 import로 순환 참조를 피합니다.
  void import("@/lib/auth/session").then(({ notifyAuthSessionChange }) => {
    notifyAuthSessionChange();
  });
}

export function clearDevAuthTokens(): void {
  if (typeof window === "undefined") {
    return;
  }

  sessionStorage.removeItem(ACCESS_TOKEN_KEY);
  sessionStorage.removeItem(REFRESH_TOKEN_KEY);
  void import("@/lib/auth/session").then(({ notifyAuthSessionChange }) => {
    notifyAuthSessionChange();
  });
}

/** 개발 로그인 폼 기본 이메일 (비밀번호는 코드/공개 env에 두지 않음) */
export function getDevLoginDefaultEmail(): string {
  return process.env.NEXT_PUBLIC_DEV_LOGIN_EMAIL?.trim() ?? "";
}
