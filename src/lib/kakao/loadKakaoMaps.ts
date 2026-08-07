import { getKakaoJavascriptKey } from "@/lib/kakao/shareTemplate";

const KAKAO_MAPS_SCRIPT_ID = "kakao-maps-sdk";
const KAKAO_MAPS_LOAD_ERROR = "Kakao Maps SDK를 불러오지 못했습니다.";
const KAKAO_MAPS_LOAD_TIMEOUT_MS = 15_000;

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

function waitForScript(
  script: HTMLScriptElement,
  resolve: (maps: KakaoMapsNamespace) => void,
  reject: (error: Error) => void,
) {
  let settled = false;

  const cleanup = () => {
    window.clearTimeout(timeoutId);
    script.removeEventListener("load", handleLoad);
    script.removeEventListener("error", handleError);
  };
  const settle = (callback: () => void) => {
    if (settled) return;
    settled = true;
    cleanup();
    callback();
  };
  const handleLoad = () => {
    script.dataset.loadStatus = "loaded";
    settle(() => resolveLoadedMaps(resolve, reject));
  };
  const handleError = () => {
    script.dataset.loadStatus = "error";
    settle(() => {
      script.remove();
      reject(new Error(KAKAO_MAPS_LOAD_ERROR));
    });
  };
  const timeoutId = window.setTimeout(handleError, KAKAO_MAPS_LOAD_TIMEOUT_MS);

  script.addEventListener("load", handleLoad, { once: true });
  script.addEventListener("error", handleError, { once: true });
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

    const existingScript = document.getElementById(
      KAKAO_MAPS_SCRIPT_ID,
    ) as HTMLScriptElement | null;
    if (existingScript) {
      if (existingScript.dataset.loadStatus === "loaded") {
        reject(new Error(KAKAO_MAPS_LOAD_ERROR));
        return;
      }
      if (existingScript.dataset.loadStatus === "error") {
        existingScript.remove();
        reject(new Error(KAKAO_MAPS_LOAD_ERROR));
        return;
      }

      waitForScript(existingScript, resolve, reject);
      return;
    }

    const script = document.createElement("script");
    script.id = KAKAO_MAPS_SCRIPT_ID;
    script.async = true;
    script.dataset.loadStatus = "loading";
    script.src = `https://dapi.kakao.com/v2/maps/sdk.js?appkey=${encodeURIComponent(javascriptKey)}&autoload=false`;
    waitForScript(script, resolve, reject);
    document.head.appendChild(script);
  }).catch((error: unknown) => {
    kakaoMapsPromise = null;
    throw error;
  });

  kakaoMapsPromise = promise;
  return promise;
}
