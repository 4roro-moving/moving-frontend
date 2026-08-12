import { isAllowedImageRemoteUrl } from "@/lib/constants/allowedImageHosts";

export const DEFAULT_MOVER_PROFILE_IMAGE = "/images/profile-character.png";

const isLocalPublicPath = (src: string) => src.startsWith("/") && !src.startsWith("//");

/**
 * 카드/목록에 넣을 프로필 이미지 URL.
 * - 로컬 `/...` 허용 (프로토콜 상대 `//` 제외)
 * - 원격은 allowlist(seed picsum + NEXT_PUBLIC_PROFILE_IMAGE_HOSTS)만 허용
 * - 그 외는 기본 이미지
 */
export function resolveMoverProfileImageSrc(src: string | null | undefined) {
  const trimmed = src?.trim() ?? "";
  if (!trimmed) {
    return DEFAULT_MOVER_PROFILE_IMAGE;
  }

  if (isLocalPublicPath(trimmed) || isAllowedImageRemoteUrl(trimmed)) {
    return trimmed;
  }

  return DEFAULT_MOVER_PROFILE_IMAGE;
}
