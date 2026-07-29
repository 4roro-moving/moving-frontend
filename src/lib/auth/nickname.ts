/**
 * Header SSR/첫 페인트용 표시 이름만 저장합니다.
 * (nickname 쿠키 + localStorage)
 */

export const NICKNAME_STORAGE_KEY = "moving_nickname";

const ONE_YEAR_SECONDS = 60 * 60 * 24 * 365;
/** 이전 전체 user 캐시 키 — 마이그레이션 시 제거 */
const LEGACY_AUTH_USER_CACHE_KEY = "moving_auth_user";

/** 쿠키 값 decode. 잘못된 % 시퀀스면 null (Layout 500 방지) */
export const safeDecodeCookieValue = (raw: string): string | null => {
  try {
    const decoded = decodeURIComponent(raw).trim();
    return decoded.length > 0 ? decoded : null;
  } catch {
    return null;
  }
};

export const saveNickname = (name: string): void => {
  if (typeof window === "undefined") return;

  const trimmed = name.trim();
  if (!trimmed) return;

  localStorage.setItem(NICKNAME_STORAGE_KEY, trimmed);
  const secureFlag = window.location.protocol === "https:" ? "; Secure" : "";
  document.cookie = `${NICKNAME_STORAGE_KEY}=${encodeURIComponent(trimmed)}; Path=/; SameSite=Lax; Max-Age=${ONE_YEAR_SECONDS}${secureFlag}`;
};

export const loadNickname = (): string | null => {
  if (typeof window === "undefined") return null;
  return localStorage.getItem(NICKNAME_STORAGE_KEY);
};

export const clearNickname = (): void => {
  if (typeof window === "undefined") return;

  localStorage.removeItem(NICKNAME_STORAGE_KEY);
  sessionStorage.removeItem(LEGACY_AUTH_USER_CACHE_KEY);
  document.cookie = `${NICKNAME_STORAGE_KEY}=; Path=/; Max-Age=0; SameSite=Lax`;
};
