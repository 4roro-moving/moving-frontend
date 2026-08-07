/**
 * 받았던/보낸 견적 목록 패널·상태 카드 공통 surface
 * Mobile: flat / md+: rounded + border + shadow-estimate-card
 * // 2026.08.07 정슬기 - [추가] rgba shadow 하드코딩 제거·토큰 통일
 */
export const ESTIMATE_LIST_PANEL_SURFACE_CLASSNAME =
  "bg-background-default md:bg-background-surface md:rounded-20 md:border-border-subtle border-0 shadow-none md:border-[0.5px] md:shadow-estimate-card";

/** 목록 패널 본문 padding (EstimateDetailPanel / EstimateRequestCard) */
export const ESTIMATE_LIST_PANEL_PADDING_CLASSNAME =
  "px-0 py-0 md:px-28 md:py-32 xl:px-40 xl:pt-48 xl:pb-40";

/** 전체 영역 에러·빈 상태 카드 */
export const ESTIMATE_STATUS_PANEL_CLASSNAME = `${ESTIMATE_LIST_PANEL_SURFACE_CLASSNAME} px-20 py-40 md:px-40 md:py-56`;

/** 인라인(재요청) 에러 카드 — 약간 낮은 padding */
export const ESTIMATE_STATUS_PANEL_COMPACT_CLASSNAME = `${ESTIMATE_LIST_PANEL_SURFACE_CLASSNAME} px-20 py-24 md:px-28 md:py-28`;
