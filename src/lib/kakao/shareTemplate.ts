import { DEFAULT_MOVER_PROFILE_IMAGE } from "@/lib/utils/moverProfileImage";

/** 기사님 상세 카카오톡 메시지 공유 템플릿 인자 */
export interface KakaoMoverShareTemplateArgs {
  driver_name: string;
  like_count: string;
  driver_profile: string;
}

/** 견적 상세 카카오톡 메시지 공유 템플릿 인자 */
export interface KakaoEstimateShareTemplateArgs {
  share_line: string;
  profile_image: string;
  /** 기사가 보낸 견적일 경우에만 기사의 찜 수 포함 */
  like_count: string;
}

export function parseKakaoTemplateId(raw: string | undefined): number | null {
  const trimmed = raw?.trim();
  if (!trimmed) {
    return null;
  }

  const templateId = Number(trimmed);
  return Number.isFinite(templateId) ? templateId : null;
}

/** NEXT_PUBLIC_* 는 정적 접근만 클라이언트 번들에 인라인됨 */
export function getMoverShareTemplateId(): number | null {
  return (
    parseKakaoTemplateId(process.env.NEXT_PUBLIC_KAKAO_MOVER_SHARE_TEMPLATE_ID) ??
    parseKakaoTemplateId(process.env.NEXT_PUBLIC_KAKAO_SHARE_TEMPLATE_ID)
  );
}

export function getEstimateShareTemplateId(): number | null {
  return parseKakaoTemplateId(process.env.NEXT_PUBLIC_KAKAO_ESTIMATE_SHARE_TEMPLATE_ID);
}

export function hasKakaoJavascriptKey(): boolean {
  return Boolean(process.env.NEXT_PUBLIC_KAKAO_JS_KEY?.trim());
}

/**프로필 이미지를 카카오 템플릿용 URL로 변환, 상대 경로는 origin이 있을 때만 절대 URL로 변환 */
export function buildKakaoShareImageUrl(src: string | null | undefined, origin?: string): string {
  const trimmed = src?.trim() || DEFAULT_MOVER_PROFILE_IMAGE;

  if (trimmed.startsWith("http://") || trimmed.startsWith("https://")) {
    return trimmed;
  }

  if (origin) {
    const path = trimmed.startsWith("/") ? trimmed : `/${trimmed}`;
    return `${origin.replace(/\/$/, "")}${path}`;
  }

  return trimmed;
}
