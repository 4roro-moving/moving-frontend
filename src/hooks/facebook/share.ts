import { ensureFacebookSdk } from "@/hooks/facebook/sdk";
import {
  FACEBOOK_APP_ID_MISSING_MESSAGE,
  FACEBOOK_SHARE_FALLBACK_ERROR,
  getFacebookShareErrorMessage,
  hasFacebookAppId,
} from "@/lib/facebook/config";

interface ShareFacebookHandlers {
  onError?: (message: string) => void;
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
      onError?.(FACEBOOK_APP_ID_MISSING_MESSAGE);
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
