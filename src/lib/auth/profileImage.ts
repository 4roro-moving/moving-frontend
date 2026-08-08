/**
 * Header SSR/첫 페인트용 표시 이미지만 저장합니다.
 * (profileImage 쿠키 + localStorage)
 */

export const PROFILE_IMAGE_STORAGE_KEY = "moving_profile_image";

const ONE_YEAR_SECONDS = 60 * 60 * 24 * 365;

export const saveProfileImage = (imageUrl: string): void => {
  if (typeof window === "undefined") return;

  const trimmed = imageUrl.trim();
  if (!trimmed) {
    clearProfileImage();
    return;
  }

  localStorage.setItem(PROFILE_IMAGE_STORAGE_KEY, imageUrl);
  const secureFlag = window.location.protocol === "https:" ? "; Secure" : "";
  document.cookie = `${PROFILE_IMAGE_STORAGE_KEY}=${encodeURIComponent(imageUrl)}; Path=/; SameSite=Lax; Max-Age=${ONE_YEAR_SECONDS}${secureFlag}`;
};

export const loadProfileImage = (): string | null => {
  if (typeof window === "undefined") return null;
  return localStorage.getItem(PROFILE_IMAGE_STORAGE_KEY);
};

export const clearProfileImage = (): void => {
  if (typeof window === "undefined") return;
  localStorage.removeItem(PROFILE_IMAGE_STORAGE_KEY);
  document.cookie = `${PROFILE_IMAGE_STORAGE_KEY}=; Path=/; Max-Age=0; SameSite=Lax`;
};
