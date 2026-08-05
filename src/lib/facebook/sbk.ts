const FACEBOOK_SDK_ID = "facebook-jssdk";
const FACEBOOK_SDK_SRC = "https://connect.facebook.net/en_US/sdk.js";

let facebookInitialized = false;

function loadFacebookSdkScript(): Promise<void> {
  if (typeof window === "undefined") {
    return Promise.reject(new Error("브라우저 환경에서만 Facebook SDK를 사용할 수 있습니다."));
  }

  if (window.FB) {
    return Promise.resolve();
  }

  const existing = document.getElementById(FACEBOOK_SDK_ID);
  if (existing) {
    return new Promise<void>((resolve, reject) => {
      existing.addEventListener("load", () => resolve(), { once: true });
      existing.addEventListener(
        "error",
        () => {
          existing.remove();
          reject(new Error("Facebook SDK 로드에 실패했습니다."));
        },
        { once: true },
      );
    });
  }

  return new Promise<void>((resolve, reject) => {
    const script = document.createElement("script");
    script.id = FACEBOOK_SDK_ID;
    script.src = FACEBOOK_SDK_SRC;
    script.async = true;
    script.defer = true;
    script.onload = () => resolve();
    script.onerror = () => {
      script.remove();
      reject(new Error("Facebook SDK 로드에 실패했습니다."));
    };
    document.head.appendChild(script);
  });
}

export async function ensureFacebookSdk(): Promise<FacebookSDK> {
  const appId = process.env.NEXT_PUBLIC_FACEBOOK_APP_ID?.trim();
  if (!appId) {
    throw new Error("NEXT_PUBLIC_FACEBOOK_APP_ID가 필요합니다.");
  }

  await loadFacebookSdkScript();

  const fb = window.FB;
  if (!fb) {
    throw new Error("Facebook SDK를 초기화할 수 없습니다.");
  }

  if (!facebookInitialized) {
    fb.init({
      appId,
      xfbml: false,
      version: "v18.0",
    });
    facebookInitialized = true;
  }

  return fb;
}
