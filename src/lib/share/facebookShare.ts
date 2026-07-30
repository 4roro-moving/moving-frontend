const FACEBOOK_SHARE_BASE = "https://www.facebook.com/sharer/sharer.php";
const POPUP_FEATURES = "width=600,height=700,noopener,noreferrer";

/**
 * Facebook 공식 sharer URL로 공유 창을 엽니다.
 * @returns false면 팝업이 차단된 경우
 * // 2026.07.30 정슬기 - [추가]
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
