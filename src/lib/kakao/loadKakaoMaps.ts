import { getKakaoJavascriptKey } from "@/lib/kakao/shareTemplate";

const KAKAO_MAPS_SCRIPT_ID = "kakao-maps-sdk";
const KAKAO_MAPS_LOAD_ERROR = "Kakao Maps SDK를 불러오지 못했습니다.";

let kakaoMapsPromise: Promise<KakaoMapsNamespace> | null = null;

function resolveLoadedMaps(
  resolve: (maps: KakaoMapsNamespace) => void,
  reject: (error: Error) => void,
) {
  const maps = window.kakao?.maps;

  if (!maps) {
    reject(new Error(KAKAO_MAPS_LOAD_ERROR));
    return;
  }

  maps.load(() => resolve(maps));
}

export function loadKakaoMaps(): Promise<KakaoMapsNamespace> {
  if (typeof window === "undefined") {
    return Promise.reject(new Error("브라우저 환경에서만 Kakao 지도를 사용할 수 있습니다."));
  }

  if (kakaoMapsPromise) {
    return kakaoMapsPromise;
  }

  const promise = new Promise<KakaoMapsNamespace>((resolve, reject) => {
    if (window.kakao?.maps) {
      resolveLoadedMaps(resolve, reject);
      return;
    }

    const javascriptKey = getKakaoJavascriptKey();
    if (!javascriptKey) {
      reject(new Error("NEXT_PUBLIC_KAKAO_JS_KEY가 필요합니다."));
      return;
    }

    const existingScript = document.getElementById(KAKAO_MAPS_SCRIPT_ID);
    if (existingScript) {
      existingScript.addEventListener("load", () => resolveLoadedMaps(resolve, reject), {
        once: true,
      });
      existingScript.addEventListener("error", () => reject(new Error(KAKAO_MAPS_LOAD_ERROR)), {
        once: true,
      });
      return;
    }

    const script = document.createElement("script");
    script.id = KAKAO_MAPS_SCRIPT_ID;
    script.async = true;
    script.src = `https://dapi.kakao.com/v2/maps/sdk.js?appkey=${encodeURIComponent(javascriptKey)}&autoload=false`;
    script.onload = () => resolveLoadedMaps(resolve, reject);
    script.onerror = () => {
      script.remove();
      reject(new Error(KAKAO_MAPS_LOAD_ERROR));
    };
    document.head.appendChild(script);
  }).catch((error: unknown) => {
    kakaoMapsPromise = null;
    throw error;
  });

  kakaoMapsPromise = promise;
  return promise;
}
