/** Facebook Graph API 버전 — https://developers.facebook.com/docs/graph-api/changelog/versions/ */
const FACEBOOK_SDK_VERSION = "v26.0";
const FACEBOOK_SDK_ID = "facebook-jssdk";
const FACEBOOK_SDK_SRC = "https://connect.facebook.net/en_US/sdk.js";
const FACEBOOK_SDK_LOAD_TIMEOUT_MS = 10_000;

const FACEBOOK_SHARE_FALLBACK_ERROR = "페이스북 공유에 실패했습니다.";
const FACEBOOK_APP_ID_MISSING_MESSAGE = "페이스북 앱 설정이 필요합니다.";
const FACEBOOK_SDK_LOAD_ERROR = "Facebook SDK 로드에 실패했습니다.";
const FACEBOOK_SDK_TIMEOUT_ERROR = "Facebook SDK 로드 시간이 초과되었습니다.";
const FACEBOOK_SDK_INIT_ERROR = "Facebook SDK를 초기화할 수 없습니다.";

let sdkReadyPromise: Promise<FacebookSDK> | null = null;
let sdkInitialized = false;

export function getFacebookAppId(): string | null {
  const appId = process.env.NEXT_PUBLIC_FACEBOOK_APP_ID?.trim();
  return appId || null;
}

export function hasFacebookAppId(): boolean {
  return Boolean(getFacebookAppId());
}

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

function removeFacebookSdkScript(): void {
  document.getElementById(FACEBOOK_SDK_ID)?.remove();
}

function initFacebookSdk(fb: FacebookSDK, appId: string): void {
  fb.init({
    appId,
    xfbml: false,
    version: FACEBOOK_SDK_VERSION,
  });
  sdkInitialized = true;
}

async function ensureFacebookSdk(): Promise<FacebookSDK> {
  if (typeof window === "undefined") {
    throw new Error("브라우저 환경에서만 Facebook SDK를 사용할 수 있습니다.");
  }

  const appId = getFacebookAppId();
  if (!appId) {
    throw new Error("NEXT_PUBLIC_FACEBOOK_APP_ID가 필요합니다.");
  }

  if (sdkInitialized && window.FB) {
    return window.FB;
  }

  // 타임아웃 등으로 init 없이 FB만 남은 경우 — 여기서 초기화
  if (window.FB && !sdkInitialized) {
    initFacebookSdk(window.FB, appId);
    return window.FB;
  }

  if (sdkReadyPromise) {
    return sdkReadyPromise;
  }

  sdkReadyPromise = new Promise<FacebookSDK>((resolve, reject) => {
    let settled = false;
    const abortController = new AbortController();
    const { signal } = abortController;

    const settle = (action: () => void) => {
      if (settled) return;
      settled = true;
      window.clearTimeout(timeoutId);
      abortController.abort();
      action();
    };

    const succeed = (fb: FacebookSDK) => {
      settle(() => resolve(fb));
    };

    const fail = (error: Error) => {
      settle(() => {
        removeFacebookSdkScript();
        sdkReadyPromise = null;
        sdkInitialized = false;
        reject(error);
      });
    };

    const timeoutId = window.setTimeout(() => {
      fail(new Error(FACEBOOK_SDK_TIMEOUT_ERROR));
    }, FACEBOOK_SDK_LOAD_TIMEOUT_MS);

    const previousAsyncInit = window.fbAsyncInit;

    window.fbAsyncInit = () => {
      previousAsyncInit?.();
      if (settled) {
        return;
      }

      const fb = window.FB;
      if (!fb) {
        fail(new Error(FACEBOOK_SDK_INIT_ERROR));
        return;
      }

      initFacebookSdk(fb, appId);
      succeed(fb);
    };

    const existing = document.getElementById(FACEBOOK_SDK_ID);
    // FB 없이 script만 있으면 신뢰하지 않고 제거 후 새로 로드
    if (existing && !window.FB) {
      existing.remove();
    } else if (existing) {
      existing.addEventListener(
        "error",
        () => {
          fail(new Error(FACEBOOK_SDK_LOAD_ERROR));
        },
        { once: true, signal },
      );
      existing.addEventListener(
        "load",
        () => {
          if (window.FB) {
            window.fbAsyncInit?.();
          }
        },
        { once: true, signal },
      );
      queueMicrotask(() => {
        if (window.FB) {
          window.fbAsyncInit?.();
        }
      });
      return;
    }

    const script = document.createElement("script");
    script.id = FACEBOOK_SDK_ID;
    script.src = FACEBOOK_SDK_SRC;
    script.async = true;
    script.defer = true;
    script.addEventListener(
      "error",
      () => {
        fail(new Error(FACEBOOK_SDK_LOAD_ERROR));
      },
      { once: true, signal },
    );
    document.head.appendChild(script);
  });

  return sdkReadyPromise;
}

interface ShareFacebookHandlers {
  onError?: (message: string) => void;
}

/**
 * Facebook Share Dialog (FB.ui).
 * 팝업이 닫힐 때까지 Promise를 유지해 호출측 busy 상태가 유지됩니다.
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
