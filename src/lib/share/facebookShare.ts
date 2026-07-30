const FACEBOOK_SHARE_BASE = "https://www.facebook.com/sharer/sharer.php";
/** noopener는 features에 넣으면 window.open 반환값이 null이 되어 실패로 오인됨 */
const POPUP_FEATURES = "width=600,height=700";

/**
 * Facebook 공식 sharer URL로 공유 창을 엽니다.
 * @returns false면 팝업이 차단된 경우
 * // 2026.07.30 정슬기 - [추가]
 * // 2026.07.30 정슬기 - [수정] features에서 noopener 제거, opener null로 분리
 */
export function openFacebookShare(url: string): boolean {
  if (typeof window === "undefined") {
    return false;
  }

  const shareUrl = `${FACEBOOK_SHARE_BASE}?u=${encodeURIComponent(url)}`;
  const popup = window.open(shareUrl, "facebook-share", POPUP_FEATURES);

  if (!popup) {
    return false;
  }

  popup.opener = null;
  return true;
}
