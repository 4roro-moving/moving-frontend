/**
 * Soft UX 힌트용 cookie + localStorage 공통 유틸.
 * (refreshToken 등 HttpOnly 세션 쿠키와 별개)
 */

const ONE_YEAR_SECONDS = 60 * 60 * 24 * 365;

export const CLIENT_STORAGE_HINT_KEYS = [
  "moving_nickname",
  "moving_role",
  "moving_profile_image",
  "moving_profile_completed",
] as const;

export type ClientStorageHintKey = (typeof CLIENT_STORAGE_HINT_KEYS)[number];

/** 쿠키 값 decode. 잘못된 % 시퀀스면 null (Layout 500 방지) */
export const safeDecodeCookieValue = (raw: string): string | null => {
  try {
    const decoded = decodeURIComponent(raw).trim();
    return decoded.length > 0 ? decoded : null;
  } catch {
    return null;
  }
};

export const setClientStorageHint = (key: ClientStorageHintKey, value: string): void => {
  if (typeof window === "undefined") return;

  localStorage.setItem(key, value);
  const secureFlag = window.location.protocol === "https:" ? "; Secure" : "";
  document.cookie = `${key}=${encodeURIComponent(value)}; Path=/; SameSite=Lax; Max-Age=${ONE_YEAR_SECONDS}${secureFlag}`;
};

export const getClientStorageHint = (key: ClientStorageHintKey): string | null => {
  if (typeof window === "undefined") return null;
  return localStorage.getItem(key);
};

export const clearClientStorageHint = (key: ClientStorageHintKey): void => {
  if (typeof window === "undefined") return;

  localStorage.removeItem(key);
  document.cookie = `${key}=; Path=/; Max-Age=0; SameSite=Lax`;
};

export const clearAllClientStorageHints = (): void => {
  for (const key of CLIENT_STORAGE_HINT_KEYS) {
    clearClientStorageHint(key);
  }
};
