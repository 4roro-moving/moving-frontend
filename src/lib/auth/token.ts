/**
 * Access Token만 localStorage에 보관합니다.
 * Refresh Token은 백엔드 HttpOnly Cookie(`refreshToken`)로 관리합니다.
 */

const ACCESS_TOKEN_KEY = "moving_access_token";
/** 이전 localStorage refresh 잔여분 정리용 */
const LEGACY_REFRESH_TOKEN_KEY = "moving_refresh_token";

export const getAccessToken = (): string | null => {
  if (typeof window === "undefined") return null;
  return localStorage.getItem(ACCESS_TOKEN_KEY);
};

export const setAccessToken = (accessToken: string): void => {
  if (typeof window === "undefined") return;
  localStorage.setItem(ACCESS_TOKEN_KEY, accessToken);
};

export const clearAuthTokens = (): void => {
  if (typeof window === "undefined") return;
  localStorage.removeItem(ACCESS_TOKEN_KEY);
  localStorage.removeItem(LEGACY_REFRESH_TOKEN_KEY);
};
