const KAKAO_SDK_SRC = "https://t1.kakaocdn.net/kakao_js_sdk/2.7.4/kakao.min.js";

let sdkLoadPromise: Promise<void> | null = null;

function getKakaoJavascriptKey(): string | null {
  const key = process.env.NEXT_PUBLIC_KAKAO_JAVASCRIPT_KEY?.trim();
  return key ? key : null;
}

function loadKakaoSdkScript(): Promise<void> {
  if (typeof window === "undefined") {
    return Promise.reject(new Error("SSR"));
  }

  if (window.Kakao) {
    return Promise.resolve();
  }

  if (sdkLoadPromise) {
    return sdkLoadPromise;
  }

  sdkLoadPromise = new Promise<void>((resolve, reject) => {
    const existing = document.querySelector<HTMLScriptElement>(`script[src="${KAKAO_SDK_SRC}"]`);
    if (existing) {
      existing.addEventListener("load", () => resolve(), { once: true });
      existing.addEventListener(
        "error",
        () => {
          sdkLoadPromise = null;
          reject(new Error("KAKAO_SDK_LOAD_FAILED"));
        },
        { once: true },
      );
      if (window.Kakao) {
        resolve();
      }
      return;
    }

    const script = document.createElement("script");
    script.src = KAKAO_SDK_SRC;
    script.async = true;
    script.onload = () => resolve();
    script.onerror = () => {
      sdkLoadPromise = null;
      reject(new Error("KAKAO_SDK_LOAD_FAILED"));
    };
    document.head.appendChild(script);
  });

  return sdkLoadPromise;
}

/**
 * Kakao JS SDK를 로드하고 한 번만 초기화합니다.
 * // 2026.07.30 정슬기 - [추가]
 */
export async function ensureKakaoInitialized(): Promise<NonNullable<Window["Kakao"]>> {
  const key = getKakaoJavascriptKey();
  if (!key) {
    throw new Error("KAKAO_KEY_MISSING");
  }

  await loadKakaoSdkScript();

  const kakao = window.Kakao;
  if (!kakao) {
    throw new Error("KAKAO_SDK_UNAVAILABLE");
  }

  if (!kakao.isInitialized()) {
    kakao.init(key);
  }

  return kakao;
}

export interface KakaoDefaultShareParams {
  url: string;
  title?: string;
  description?: string;
}

/**
 * 공개 가능한 최소 정보로 카카오톡 기본 공유를 실행합니다.
 * (주소·실명·견적 상세·기사님 이름 등은 포함하지 않음)
 * // 2026.07.30 정슬기 - [추가]
 */
export async function shareKakaoDefault(params: KakaoDefaultShareParams): Promise<void> {
  const kakao = await ensureKakaoInitialized();

  const title = params.title ?? "무빙";
  const description =
    params.description ?? "이사 견적을 비교하고 믿을 수 있는 기사님을 찾는 플랫폼, 무빙";

  // 공개 대표 이미지가 없어 text 타입으로 공유 (민감 정보 미포함)
  kakao.Share.sendDefault({
    objectType: "text",
    text: `${title}\n${description}`,
    link: {
      mobileWebUrl: params.url,
      webUrl: params.url,
    },
  });
}

export function getKakaoShareErrorMessage(error: unknown): string {
  if (error instanceof Error) {
    if (error.message === "KAKAO_KEY_MISSING") {
      return "카카오 공유 설정이 되어 있지 않습니다. 관리자에게 문의해주세요.";
    }
    if (error.message === "KAKAO_SDK_LOAD_FAILED" || error.message === "KAKAO_SDK_UNAVAILABLE") {
      return "카카오톡 공유를 불러오지 못했습니다. 잠시 후 다시 시도해주세요.";
    }
  }
  return "카카오톡 공유에 실패했습니다. 잠시 후 다시 시도해주세요.";
}
