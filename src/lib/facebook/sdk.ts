const FACEBOOK_SDK_ID = "facebook-jssdk";
const FACEBOOK_SDK_SRC = "https://connect.facebook.net/en_US/sdk.js";
const FACEBOOK_SDK_LOAD_ERROR = "Facebook SDK 로드에 실패했습니다.";
const FACEBOOK_SDK_VERSION = "v26.0";

let sdkReadyPromise: Promise<FacebookSDK> | null = null;

function getFacebookAppIdFromEnv(): string | null {
  const appId = process.env.NEXT_PUBLIC_FACEBOOK_APP_ID?.trim();
  return appId || null;
}

/** Facebook JS SDK 로드 후 App ID로 초기화 (브라우저 전용) */
export async function ensureFacebookSdk(): Promise<FacebookSDK> {
  if (typeof window === "undefined") {
    throw new Error("브라우저 환경에서만 Facebook SDK를 사용할 수 있습니다.");
  }

  const appId = getFacebookAppIdFromEnv();
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
    const previousAsyncInit = window.fbAsyncInit;

    window.fbAsyncInit = () => {
      previousAsyncInit?.();

      const fb = window.FB;
      if (!fb) {
        sdkReadyPromise = null;
        reject(new Error("Facebook SDK를 초기화할 수 없습니다."));
        return;
      }

      fb.init({
        appId,
        xfbml: false,
        version: FACEBOOK_SDK_VERSION,
      });
      resolve(fb);
    };

    const existing = document.getElementById(FACEBOOK_SDK_ID);
    if (existing) {
      existing.addEventListener(
        "error",
        () => {
          existing.remove();
          sdkReadyPromise = null;
          reject(new Error(FACEBOOK_SDK_LOAD_ERROR));
        },
        { once: true },
      );
      existing.addEventListener(
        "load",
        () => {
          if (window.FB) {
            window.fbAsyncInit?.();
          }
        },
        { once: true },
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
    script.onerror = () => {
      script.remove();
      sdkReadyPromise = null;
      reject(new Error(FACEBOOK_SDK_LOAD_ERROR));
    };
    document.head.appendChild(script);
  });

  return sdkReadyPromise;
}

export function hasFacebookAppId(): boolean {
  return Boolean(getFacebookAppIdFromEnv());
}

export function getFacebookAppId(): string | null {
  return getFacebookAppIdFromEnv();
}
