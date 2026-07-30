/** 기사님 상세 OG description */
export const MOVER_SHARE_DESCRIPTION = "무빙에서 확인해 보세요!";

export function buildMoverShareTitle(nickname: string): string {
  return `이사를 준비하시나요? ${nickname} 기사님을 추천합니다.`;
}

/** 견적 상세 OG title */
export const ESTIMATE_SHARE_OG_TITLE = "이사를 준비하시나요?";

/** 견적 상세 카카오톡 공유 / OG description 공통 문구 */
export function buildEstimateShareLine(moverName?: string | null): string {
  const name = moverName?.trim();
  if (name) {
    return `${name} 기사님에게 받은 이사 견적입니다.`;
  }
  return "요청한 이사 견적입니다.";
}
