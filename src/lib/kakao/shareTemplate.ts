import { DEFAULT_MOVER_PROFILE_IMAGE } from "@/lib/utils/moverProfileImage";

/** 기사님 상세 카카오톡 메시지 공유 템플릿 인자 */
export interface KakaoMoverShareTemplateArgs {
  driver_name: string;
  like_count: string;
  driver_profile: string;
}

export function parseKakaoTemplateId(raw: string | undefined): number | null {
  const trimmed = raw?.trim();
  if (!trimmed) {
    return null;
  }

  const templateId = Number(trimmed);
  if (!Number.isSafeInteger(templateId) || templateId <= 0) {
    return null;
  }

  return templateId;
}

/** NEXT_PUBLIC_* 는 정적 접근만 클라이언트 번들에 인라인됨 */
export function getMoverShareTemplateId(): number | null {
  return (
    parseKakaoTemplateId(process.env.NEXT_PUBLIC_KAKAO_MOVER_SHARE_TEMPLATE_ID) ??
    parseKakaoTemplateId(process.env.NEXT_PUBLIC_KAKAO_SHARE_TEMPLATE_ID)
  );
}

export function hasKakaoJavascriptKey(): boolean {
  return Boolean(process.env.NEXT_PUBLIC_KAKAO_JS_KEY?.trim());
}

export function getKakaoJavascriptKey(): string | null {
  const key = process.env.NEXT_PUBLIC_KAKAO_JS_KEY?.trim();
  return key || null;
}

/** 프로필 이미지를 카카오 템플릿용 URL로 변환, 상대 경로는 origin이 있을 때만 절대 URL로 변환 */
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
