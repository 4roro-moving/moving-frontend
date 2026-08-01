import { ensureKakaoSdk } from "@/hooks/kakao/sdk";
import {
  buildKakaoShareImageUrl,
  getMoverShareTemplateId,
  hasKakaoJavascriptKey,
  type KakaoMoverShareTemplateArgs,
} from "@/lib/kakao/shareTemplate";

export type { KakaoMoverShareTemplateArgs };

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
