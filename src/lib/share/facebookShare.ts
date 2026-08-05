import { ensureFacebookSdk, hasFacebookAppId } from "@/lib/facebook/sdk";

interface ShareFacebookHandlers {
  onError?: (message: string) => void;
}

const FACEBOOK_SHARE_FALLBACK_ERROR = "페이스북 공유에 실패했습니다.";

function getFacebookShareErrorMessage(response?: FacebookShareResponse): string {
  const raw = response?.error_message?.trim();
  if (!raw) {
    return FACEBOOK_SHARE_FALLBACK_ERROR;
  }

  try {
    return decodeURIComponent(raw.replace(/\+/g, " "));
  } catch {
    return raw;
  }
}

/**
 * Facebook Share Dialog (FB.ui).
 * 팝업이 닫힐 때까지 Promise를 유지해 호출측 busy 상태가 유지됩니다.
 * Share Dialog는 성공/취소 구분이 불안정하므로 성공 콜백은 다루지 않습니다.
 */
export async function shareFacebook({
  href,
  onError,
}: ShareFacebookHandlers & { href: string }): Promise<void> {
  try {
    if (!hasFacebookAppId()) {
      onError?.("페이스북 앱 설정이 필요합니다.");
      return;
    }

    const fb = await ensureFacebookSdk();

    await new Promise<void>((resolve) => {
      fb.ui(
        {
          method: "share",
          href,
          display: "popup",
        },
        (response) => {
          if (response?.error_code || response?.error_message) {
            onError?.(getFacebookShareErrorMessage(response));
          }
          resolve();
        },
      );
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : FACEBOOK_SHARE_FALLBACK_ERROR;
    onError?.(message);
  }
}

export { getFacebookAppId, hasFacebookAppId } from "@/lib/facebook/sdk";
