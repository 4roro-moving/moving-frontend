import { ensureFacebookSdk } from "@/lib/facebook/sbk";

interface ShareFacebookHandlers {
  onError?: (message: string) => void;
  onSuccess?: () => void;
}

export async function shareFacebook({
  href,
  onError,
  onSuccess,
}: ShareFacebookHandlers & { href: string }): Promise<void> {
  try {
    const appId = process.env.NEXT_PUBLIC_FACEBOOK_APP_ID?.trim();
    if (!appId) {
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
      (response: FacebookShareResponse) => {
        if (response && !response.error_code) {
          onSuccess?.();
        } else if (response?.error_message) {
          onError?.(response.error_message);
        }
      },
    );
  } catch (error) {
    const message = error instanceof Error ? error.message : "페이스북 공유에 실패했습니다.";
    onError?.(message);
  }
}

export function hasFacebookAppId(): boolean {
  return Boolean(process.env.NEXT_PUBLIC_FACEBOOK_APP_ID?.trim());
}

export function getFacebookAppId(): string | null {
  const appId = process.env.NEXT_PUBLIC_FACEBOOK_APP_ID?.trim();
  return appId || null;
}
