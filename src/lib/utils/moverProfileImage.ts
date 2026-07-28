export const DEFAULT_MOVER_PROFILE_IMAGE = "/images/profile-character.png";

/**
 * 카드/목록에 넣을 프로필 이미지 URL.
 * 값이 없으면 기본 이미지, 있으면 API URL을 그대로 사용한다.
 */
export function resolveMoverProfileImageSrc(src: string | null | undefined) {
  const trimmed = src?.trim() ?? "";
  if (!trimmed) {
    return DEFAULT_MOVER_PROFILE_IMAGE;
  }
  return trimmed;
}
