const KAKAO_SDK_SCRIPT_ID = "kakao-js-sdk";
const KAKAO_SDK_SRC = "https://t1.kakaocdn.net/kakao_js_sdk/2.7.5/kakao.min.js";

function loadKakaoSdkScript(): Promise<void> {
  if (typeof window === "undefined") {
    return Promise.reject(new Error("브라우저 환경에서만 Kakao SDK를 사용할 수 있습니다."));
  }

  if (window.Kakao) {
    return Promise.resolve();
  }

  const existing = document.getElementById(KAKAO_SDK_SCRIPT_ID);
  if (existing) {
    return new Promise((resolve, reject) => {
      existing.addEventListener("load", () => resolve(), { once: true });
      existing.addEventListener(
        "error",
        () => reject(new Error("Kakao SDK 로드에 실패했습니다.")),
        {
          once: true,
        },
      );
    });
  }

  return new Promise((resolve, reject) => {
    const script = document.createElement("script");
    script.id = KAKAO_SDK_SCRIPT_ID;
    script.src = KAKAO_SDK_SRC;
    script.async = true;
    script.onload = () => resolve();
    script.onerror = () => reject(new Error("Kakao SDK 로드에 실패했습니다."));
    document.head.appendChild(script);
  });
}

/** Kakao JS SDK 로드 후 JavaScript 키로 초기화 */
export async function ensureKakaoSdk(): Promise<KakaoSDK> {
  const javascriptKey = process.env.NEXT_PUBLIC_KAKAO_JS_KEY?.trim();
  if (!javascriptKey) {
    throw new Error("NEXT_PUBLIC_KAKAO_JS_KEY가 필요합니다.");
  }

  await loadKakaoSdkScript();

  const kakao = window.Kakao;
  if (!kakao) {
    throw new Error("Kakao SDK를 초기화할 수 없습니다.");
  }

  if (!kakao.isInitialized()) {
    kakao.init(javascriptKey);
  }

  return kakao;
}
