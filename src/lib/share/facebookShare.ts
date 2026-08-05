import { ensureFacebookSdk, hasFacebookAppId } from "@/lib/facebook/sdk";

interface ShareFacebookHandlers {
  onError?: (message: string) => void;
}

/**
 * Facebook Share Dialog (FB.ui).
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

    fb.ui(
      {
        method: "share",
        href,
        display: "popup",
      },
      (response) => {
        if (response?.error_code && response.error_message) {
          onError?.(decodeURIComponent(response.error_message.replace(/\+/g, " ")));
        }
      },
    );
  } catch (error) {
    const message = error instanceof Error ? error.message : "페이스북 공유에 실패했습니다.";
    onError?.(message);
  }
}

export { getFacebookAppId, hasFacebookAppId } from "@/lib/facebook/sdk";
