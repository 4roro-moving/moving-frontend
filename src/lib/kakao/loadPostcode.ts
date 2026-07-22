import type { KakaoPostcodeConstructor } from "@/types/kakao-postcode";

const POSTCODE_SCRIPT_SRC = "https://t1.kakaocdn.net/mapjsapi/bundle/postcode/prod/postcode.v2.js";
const SCRIPT_ID = "kakao-postcode-script";

let loadingPromise: Promise<KakaoPostcodeConstructor> | null = null;

function getPostcodeConstructor(): KakaoPostcodeConstructor | null {
  return window.kakao?.Postcode ?? window.daum?.Postcode ?? null;
}

/**
 * Kakao 우편번호 스크립트를 한 번만 로드하고 Postcode 생성자를 반환한다.
 * (API Key 발급 불필요 — https://postcode.map.kakao.com/guide)
 */
export function loadKakaoPostcode(): Promise<KakaoPostcodeConstructor> {
  if (typeof window === "undefined") {
    return Promise.reject(new Error("Kakao Postcode는 브라우저 환경에서만 사용할 수 있습니다."));
  }

  const existing = getPostcodeConstructor();
  if (existing) return Promise.resolve(existing);

  if (loadingPromise) return loadingPromise;

  loadingPromise = new Promise((resolve, reject) => {
    const prev = document.getElementById(SCRIPT_ID) as HTMLScriptElement | null;
    if (prev) {
      prev.addEventListener("load", () => {
        const ctor = getPostcodeConstructor();
        if (ctor) resolve(ctor);
        else reject(new Error("Kakao Postcode 생성자를 찾을 수 없습니다."));
      });
      prev.addEventListener("error", () =>
        reject(new Error("Kakao Postcode 스크립트 로드에 실패했습니다.")),
      );
      return;
    }

    const script = document.createElement("script");
    script.id = SCRIPT_ID;
    script.src = POSTCODE_SCRIPT_SRC;
    script.async = true;
    script.onload = () => {
      const ctor = getPostcodeConstructor();
      if (ctor) resolve(ctor);
      else reject(new Error("Kakao Postcode 생성자를 찾을 수 없습니다."));
    };
    script.onerror = () => {
      loadingPromise = null;
      reject(new Error("Kakao Postcode 스크립트 로드에 실패했습니다."));
    };
    document.head.appendChild(script);
  });

  return loadingPromise;
}
