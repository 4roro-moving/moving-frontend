import {
  clearClientStorageHint,
  getClientStorageHint,
  setClientStorageHint,
} from "@/lib/auth/clientStorageHint";

/**
 * Header SSR/첫 페인트용 표시 이름만 저장합니다.
 * (nickname Soft UX 쿠키)
 */

export const NICKNAME_STORAGE_KEY = "moving_nickname" as const;

/** Soft UX 표시·쿠키 용량 제한 */
const MAX_NICKNAME_HINT_LENGTH = 50;

/** 이전 전체 user 캐시 키 — 마이그레이션 시 제거 */
const LEGACY_AUTH_USER_CACHE_KEY = "moving_auth_user";

/** @deprecated `@/lib/auth/clientStorageHint`에서 import하세요. 기존 경로 호환용 */
export { safeDecodeCookieValue } from "@/lib/auth/clientStorageHint";

/** Soft UX용 표시 이름. 제어문자 제거·길이 제한 */
export const sanitizeSoftUxNickname = (value: string | null | undefined): string | null => {
  const trimmed = value?.trim() ?? "";
  if (!trimmed) return null;

  const cleaned = trimmed.replace(/[\u0000-\u001F\u007F]/g, "").slice(0, MAX_NICKNAME_HINT_LENGTH);

  return cleaned.length > 0 ? cleaned : null;
};

export const saveNickname = (name: string): void => {
  const safe = sanitizeSoftUxNickname(name);
  if (!safe) return;

  setClientStorageHint(NICKNAME_STORAGE_KEY, safe);
};

export const loadNickname = (): string | null => {
  return sanitizeSoftUxNickname(getClientStorageHint(NICKNAME_STORAGE_KEY));
};

export const clearNickname = (): void => {
  if (typeof window === "undefined") return;

  clearClientStorageHint(NICKNAME_STORAGE_KEY);
  sessionStorage.removeItem(LEGACY_AUTH_USER_CACHE_KEY);
};
