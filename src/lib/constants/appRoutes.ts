/**
 * 프론트엔드 페이지 경로 상수
 * API 경로(`API_ROUTES`)와 분리합니다.
 * // 2026.07.25 정슬기 - [추가]
 */
export const APP_ROUTES = {
  LOGIN: "/login",
  DEV_LOGIN: "/dev-login",
  // 2026.07.27 정슬기 - [추가] 기사님 찾기·상세 페이지 경로
  MOVERS: {
    ROOT: "/movers",
    DETAIL: (moverId: string) => `/movers/${moverId}`,
  },
  // 2026.07.27 정슬기 - [추가] 고객 리뷰 관리 페이지 경로
  REVIEWS: {
    ROOT: "/reviews",
    WRITABLE: "/reviews/writable",
    ME: "/reviews/me",
  },
  /**
   * NOTE: 찜한 기사님 전체 목록 페이지. 경로 확정 시 현재 상수값,  `src/app/favorites/movers/` 디렉터리 수정 필요
   */
  FAVORITE_MOVERS: "/favorites/movers",
  /** 고객 일반 견적 요청 */
  ESTIMATE_REQUEST: "/estimate-request",
} as const;
