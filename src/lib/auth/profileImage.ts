import {
  clearClientStorageHint,
  getClientStorageHint,
  setClientStorageHint,
} from "@/lib/auth/clientStorageHint";

/**
 * Header SSR/첫 페인트용 표시 이미지만 저장합니다.
 * (profileImage 쿠키 + localStorage)
 */

export const PROFILE_IMAGE_STORAGE_KEY = "moving_profile_image" as const;

export const saveProfileImage = (imageUrl: string): void => {
  const trimmed = imageUrl.trim();
  if (!trimmed) {
    clearProfileImage();
    return;
  }

  setClientStorageHint(PROFILE_IMAGE_STORAGE_KEY, imageUrl);
};

export const loadProfileImage = (): string | null => {
  return getClientStorageHint(PROFILE_IMAGE_STORAGE_KEY);
};

export const clearProfileImage = (): void => {
  clearClientStorageHint(PROFILE_IMAGE_STORAGE_KEY);
};
