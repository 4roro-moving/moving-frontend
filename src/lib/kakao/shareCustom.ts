import { ensureKakaoSdk } from "@/lib/kakao/sdk";
import { DEFAULT_MOVER_PROFILE_IMAGE } from "@/lib/utils/moverProfileImage";

/** 기사님 상세 사용자 정의 템플릿 인자 (#{driver_name} 등) */
export interface KakaoMoverShareTemplateArgs {
  driver_name: string;
  like_count: string;
  driver_profile: string;
}

/** 견적 상세 사용자 정의 템플릿 인자 (#{share_line} = 완성 문장, #{profile_image}, #{like_count}) */
export interface KakaoEstimateShareTemplateArgs {
  share_line: string;
  profile_image: string;
  /** 기사 견적만 찜 수. 요청만인 경우 빈 문자열 */
  like_count: string;
}

interface ShareKakaoHandlers {
  onMissingConfig?: () => void;
  onError?: (message: string) => void;
}

function parseTemplateId(raw: string | undefined): number | null {
  const trimmed = raw?.trim();
  if (!trimmed) {
    return null;
  }

  const templateId = Number(trimmed);
  return Number.isFinite(templateId) ? templateId : null;
}

/**
 * Next.js는 process.env[동적키]를 클라이언트에 인라인하지 않음.
 * NEXT_PUBLIC_* 는 반드시 정적 프로퍼티로 접근해야 함.
 */
function getMoverShareTemplateId(): number | null {
  return (
    parseTemplateId(process.env.NEXT_PUBLIC_KAKAO_MOVER_SHARE_TEMPLATE_ID) ??
    parseTemplateId(process.env.NEXT_PUBLIC_KAKAO_SHARE_TEMPLATE_ID)
  );
}

function getEstimateShareTemplateId(): number | null {
  return parseTemplateId(process.env.NEXT_PUBLIC_KAKAO_ESTIMATE_SHARE_TEMPLATE_ID);
}

async function sendKakaoCustomShare({
  templateId,
  templateArgs,
  onMissingConfig,
  onError,
}: {
  templateId: number | null;
  templateArgs: KakaoMoverShareTemplateArgs | KakaoEstimateShareTemplateArgs;
  onMissingConfig?: () => void;
  onError?: (message: string) => void;
}): Promise<void> {
  const hasJsKey = Boolean(process.env.NEXT_PUBLIC_KAKAO_JS_KEY?.trim());

  if (!hasJsKey || templateId === null) {
    onMissingConfig?.();
    return;
  }

  try {
    const kakao = await ensureKakaoSdk();
    kakao.Share.sendCustom({
      templateId,
      templateArgs: { ...templateArgs },
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : "카카오톡 공유에 실패했습니다.";
    onError?.(message);
  }
}

/** 기사님 상세 — NEXT_PUBLIC_KAKAO_MOVER_SHARE_TEMPLATE_ID */
export async function shareKakaoMoverCustom({
  templateArgs,
  onMissingConfig,
  onError,
}: ShareKakaoHandlers & { templateArgs: KakaoMoverShareTemplateArgs }): Promise<void> {
  return sendKakaoCustomShare({
    templateId: getMoverShareTemplateId(),
    templateArgs,
    onMissingConfig,
    onError,
  });
}

/** 견적 상세 — NEXT_PUBLIC_KAKAO_ESTIMATE_SHARE_TEMPLATE_ID */
export async function shareKakaoEstimateCustom({
  templateArgs,
  onMissingConfig,
  onError,
}: ShareKakaoHandlers & { templateArgs: KakaoEstimateShareTemplateArgs }): Promise<void> {
  return sendKakaoCustomShare({
    templateId: getEstimateShareTemplateId(),
    templateArgs,
    onMissingConfig,
    onError,
  });
}

/** 프로필 이미지를 카카오 템플릿용 절대 URL로 변환 */
export function toKakaoShareImageUrl(src: string | null | undefined): string {
  const trimmed = src?.trim() || DEFAULT_MOVER_PROFILE_IMAGE;

  if (trimmed.startsWith("http://") || trimmed.startsWith("https://")) {
    return trimmed;
  }

  if (typeof window !== "undefined") {
    const path = trimmed.startsWith("/") ? trimmed : `/${trimmed}`;
    return `${window.location.origin}${path}`;
  }

  return trimmed;
}
