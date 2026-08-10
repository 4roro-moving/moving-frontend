import {
  clearClientStorageHint,
  getClientStorageHint,
  setClientStorageHint,
} from "@/lib/auth/clientStorageHint";

/**
 * Header·가드용 프로필 완료 힌트 (cookie + localStorage)
 * - true: status 생략 가능 (Soft UX)
 * - false: 미완료 낙관 표시 후 status로 확정
 * - null: 힌트 없음 → status 조회
 */

export const PROFILE_COMPLETED_STORAGE_KEY = "moving_profile_completed" as const;

export const parseProfileCompleted = (value: string | null | undefined): boolean | null => {
  if (value === "true") return true;
  if (value === "false") return false;
  return null;
};

export const saveProfileCompleted = (isCompleted: boolean): void => {
  setClientStorageHint(PROFILE_COMPLETED_STORAGE_KEY, isCompleted ? "true" : "false");
};

export const loadProfileCompleted = (): boolean | null => {
  return parseProfileCompleted(getClientStorageHint(PROFILE_COMPLETED_STORAGE_KEY));
};

export const clearProfileCompleted = (): void => {
  clearClientStorageHint(PROFILE_COMPLETED_STORAGE_KEY);
};
