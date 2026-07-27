export const DEFAULT_MOVER_PROFILE_IMAGE = "/images/profile-character.png";

/**
 * Next Image(`/_next/image`)로 받아올 때 자주 504가 발생하는 외부 호스트
 * 이 주소는 프록시에 넘기지 않고 기본 이미지로 대체
 */
const UNRELIABLE_PROFILE_HOSTS = new Set(["picsum.photos", "fastly.picsum.photos"]);

/** URL 호스트가 UNRELIABLE_PROFILE_HOSTS에 포함되는지 확인 */
function isUnreliableProfileHost(src: string) {
  try {
    const { hostname } = new URL(src);
    return UNRELIABLE_PROFILE_HOSTS.has(hostname);
  } catch {
    return false;
  }
}

/**
 * 카드/목록에 실제로 넣을 프로필 이미지 URL
 * 값이 없거나 불안정한 호스트면 기본 이미지 반환
 */
export function resolveMoverProfileImageSrc(src: string | null | undefined) {
  const trimmed = src?.trim() ?? "";
  if (!trimmed || isUnreliableProfileHost(trimmed)) {
    return DEFAULT_MOVER_PROFILE_IMAGE;
  }
  return trimmed;
}
