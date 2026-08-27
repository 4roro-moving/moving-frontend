import { DEFAULT_PROFILE_IMAGE, getAllowedImageSrc } from "@/lib/utils/safeImageSrc";

export const DEFAULT_MOVER_PROFILE_IMAGE = DEFAULT_PROFILE_IMAGE;

/**
 * 카드/목록에 넣을 프로필 이미지 URL.
 * allowlist를 통과하면 그대로, 그 외·빈 값은 기본 캐릭터 이미지.
 */
export const resolveMoverProfileImageSrc = (src: string | null | undefined) => {
  return getAllowedImageSrc(src) ?? DEFAULT_PROFILE_IMAGE;
};
