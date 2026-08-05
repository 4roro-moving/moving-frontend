import {
  buildKakaoShareImageUrl,
  getKakaoJavascriptKey,
  getMoverShareTemplateId,
  hasKakaoJavascriptKey,
  type KakaoMoverShareTemplateArgs,
} from "@/lib/kakao/shareTemplate";

export type { KakaoMoverShareTemplateArgs };

const KAKAO_SDK_SCRIPT_ID = "kakao-js-sdk";
const KAKAO_SDK_SRC = "https://t1.kakaocdn.net/kakao_js_sdk/2.7.5/kakao.min.js";
const KAKAO_SDK_LOAD_ERROR = "Kakao SDK 로드에 실패했습니다.";
const KAKAO_SDK_TIMEOUT_ERROR = "Kakao SDK 로드 시간이 초과되었습니다.";
const KAKAO_SDK_LOAD_TIMEOUT_MS = 10_000;

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
      if (window.Kakao) {
        resolve();
        return;
      }

      const timeoutId = window.setTimeout(() => {
        existing.remove();
        reject(new Error(KAKAO_SDK_TIMEOUT_ERROR));
      }, KAKAO_SDK_LOAD_TIMEOUT_MS);

      existing.addEventListener(
        "load",
        () => {
          window.clearTimeout(timeoutId);
          resolve();
        },
        { once: true },
      );
      existing.addEventListener(
        "error",
        () => {
          window.clearTimeout(timeoutId);
          existing.remove();
          reject(new Error(KAKAO_SDK_LOAD_ERROR));
        },
        { once: true },
      );
    });
  }

  return new Promise((resolve, reject) => {
    const script = document.createElement("script");
    script.id = KAKAO_SDK_SCRIPT_ID;
    script.src = KAKAO_SDK_SRC;
    script.async = true;

    const timeoutId = window.setTimeout(() => {
      script.remove();
      reject(new Error(KAKAO_SDK_TIMEOUT_ERROR));
    }, KAKAO_SDK_LOAD_TIMEOUT_MS);

    script.onload = () => {
      window.clearTimeout(timeoutId);
      resolve();
    };
    script.onerror = () => {
      window.clearTimeout(timeoutId);
      script.remove();
      reject(new Error(KAKAO_SDK_LOAD_ERROR));
    };
    document.head.appendChild(script);
  });
}

async function ensureKakaoSdk(): Promise<KakaoSDK> {
  const javascriptKey = getKakaoJavascriptKey();
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

interface ShareKakaoHandlers {
  onMissingConfig?: () => void;
  onSuccess?: () => void;
  onError?: (message: string) => void;
}

async function sendKakaoCustomShare({
  templateId,
  templateArgs,
  onMissingConfig,
  onSuccess,
  onError,
}: {
  templateId: number | null;
  templateArgs: KakaoMoverShareTemplateArgs;
  onMissingConfig?: () => void;
  onSuccess?: () => void;
  onError?: (message: string) => void;
}): Promise<void> {
  if (!hasKakaoJavascriptKey() || templateId === null) {
    onMissingConfig?.();
    return;
  }

  try {
    const kakao = await ensureKakaoSdk();
    kakao.Share.sendCustom({
      templateId,
      templateArgs: { ...templateArgs },
    });
    onSuccess?.();
  } catch (error) {
    const message = error instanceof Error ? error.message : "카카오톡 공유에 실패했습니다.";
    onError?.(message);
  }
}

/** 기사님 상세 — NEXT_PUBLIC_KAKAO_MOVER_SHARE_TEMPLATE_ID */
export async function shareKakaoMoverCustom({
  templateArgs,
  onMissingConfig,
  onSuccess,
  onError,
}: ShareKakaoHandlers & { templateArgs: KakaoMoverShareTemplateArgs }): Promise<void> {
  return sendKakaoCustomShare({
    templateId: getMoverShareTemplateId(),
    templateArgs,
    onMissingConfig,
    onSuccess,
    onError,
  });
}

/** 클라이언트에서 프로필 이미지를 카카오 템플릿용 절대 URL로 변환 */
export function toKakaoShareImageUrl(src: string | null | undefined): string {
  const origin = typeof window !== "undefined" ? window.location.origin : undefined;
  return buildKakaoShareImageUrl(src, origin);
}
