import {
  FACEBOOK_SDK_INIT_ERROR,
  FACEBOOK_SDK_LOAD_ERROR,
  FACEBOOK_SDK_TIMEOUT_ERROR,
  FACEBOOK_SDK_VERSION,
  getFacebookAppId,
} from "@/lib/facebook/config";

const FACEBOOK_SDK_ID = "facebook-jssdk";
const FACEBOOK_SDK_SRC = "https://connect.facebook.net/en_US/sdk.js";
const FACEBOOK_SDK_LOAD_TIMEOUT_MS = 10_000;

let sdkReadyPromise: Promise<FacebookSDK> | null = null;

function removeFacebookSdkScript(): void {
  document.getElementById(FACEBOOK_SDK_ID)?.remove();
}

/** Facebook JS SDK 로드 후 App ID로 초기화 (브라우저 전용) */
export async function ensureFacebookSdk(): Promise<FacebookSDK> {
  if (typeof window === "undefined") {
    throw new Error("브라우저 환경에서만 Facebook SDK를 사용할 수 있습니다.");
  }

  const appId = getFacebookAppId();
  if (!appId) {
    throw new Error("NEXT_PUBLIC_FACEBOOK_APP_ID가 필요합니다.");
  }

  if (window.FB) {
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

      fb.init({
        appId,
        xfbml: false,
        version: FACEBOOK_SDK_VERSION,
      });
      succeed(fb);
    };

    const existing = document.getElementById(FACEBOOK_SDK_ID);
    if (existing) {
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
      // 이미 로드 완료된 경우 load 이벤트가 다시 안 올 수 있음
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
