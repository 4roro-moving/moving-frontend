import {
  clearClientStorageHint,
  getClientStorageHint,
  setClientStorageHint,
} from "@/lib/auth/clientStorageHint";
import { getAllowedImageSrc } from "@/lib/utils/safeImageSrc";

/**
 * Header SSR/첫 페인트용 표시 이미지만 저장합니다.
 * (profileImage Soft UX 쿠키)
 */

/** Soft UX 쿠키 용량·남용 방지 */
const MAX_PROFILE_IMAGE_HINT_LENGTH = 2048;

export const PROFILE_IMAGE_STORAGE_KEY = "moving_profile_image" as const;

/**
 * Soft UX용 프로필 이미지 URL.
 * - 쿠키 용량 제한 후 getAllowedImageSrc로 로컬·allowlist만 통과
 * - javascript:/data:/http: 등은 null
 */
export const sanitizeSoftUxProfileImageUrl = (value: string | null | undefined): string | null => {
  const trimmed = value?.trim() ?? "";
  if (!trimmed || trimmed.length > MAX_PROFILE_IMAGE_HINT_LENGTH) {
    return null;
  }

  return getAllowedImageSrc(trimmed);
};

export const saveProfileImage = (imageUrl: string): void => {
  const safe = sanitizeSoftUxProfileImageUrl(imageUrl);
  if (!safe) {
    clearProfileImage();
    return;
  }

  setClientStorageHint(PROFILE_IMAGE_STORAGE_KEY, safe);
};

export const loadProfileImage = (): string | null => {
  return sanitizeSoftUxProfileImageUrl(getClientStorageHint(PROFILE_IMAGE_STORAGE_KEY));
};

export const clearProfileImage = (): void => {
  clearClientStorageHint(PROFILE_IMAGE_STORAGE_KEY);
};
