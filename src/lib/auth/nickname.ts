import {
  clearClientStorageHint,
  getClientStorageHint,
  setClientStorageHint,
} from "@/lib/auth/clientStorageHint";

/**
 * Header SSR/첫 페인트용 표시 이름만 저장합니다.
 * (nickname 쿠키 + localStorage)
 */

export const NICKNAME_STORAGE_KEY = "moving_nickname" as const;

/** 이전 전체 user 캐시 키 — 마이그레이션 시 제거 */
const LEGACY_AUTH_USER_CACHE_KEY = "moving_auth_user";

/** @deprecated `@/lib/auth/clientStorageHint`에서 import하세요. 기존 경로 호환용 */
export { safeDecodeCookieValue } from "@/lib/auth/clientStorageHint";

export const saveNickname = (name: string): void => {
  const trimmed = name.trim();
  if (!trimmed) return;

  setClientStorageHint(NICKNAME_STORAGE_KEY, trimmed);
};

export const loadNickname = (): string | null => {
  return getClientStorageHint(NICKNAME_STORAGE_KEY);
};

export const clearNickname = (): void => {
  if (typeof window === "undefined") return;

  clearClientStorageHint(NICKNAME_STORAGE_KEY);
  sessionStorage.removeItem(LEGACY_AUTH_USER_CACHE_KEY);
};
