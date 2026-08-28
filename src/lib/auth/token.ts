/**
 * Access token은 메모리에만 보관합니다.
 * Refresh token은 서버가 내려주는 HttpOnly 쿠키로만 유지됩니다.
 */

/** 백엔드 HttpOnly Refresh Token 쿠키 이름 및 경로 */
export const REFRESH_TOKEN_COOKIE_NAME = "refreshToken";
export const REFRESH_TOKEN_COOKIE_BACKEND_PATH = "/api/auth";

let accessToken: string | null = null;

const LEGACY_ACCESS_TOKEN_KEY = "moving_access_token";
const LEGACY_REFRESH_TOKEN_KEY = "moving_refresh_token";

const clearLegacyStorage = (): void => {
  if (typeof window === "undefined") return;
  localStorage.removeItem(LEGACY_ACCESS_TOKEN_KEY);
  localStorage.removeItem(LEGACY_REFRESH_TOKEN_KEY);
};

export const getAccessToken = (): string | null => {
  return accessToken;
};

export const setAccessToken = (token: string): void => {
  accessToken = token;
  clearLegacyStorage();
};

export const clearAuthTokens = (): void => {
  accessToken = null;
  clearLegacyStorage();
};
