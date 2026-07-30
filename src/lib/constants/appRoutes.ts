/**
 * 프론트엔드 페이지 경로 상수
 * API 경로(`API_ROUTES`)와 분리합니다.
 * // 2026.07.25 정슬기 - [추가]
 */
export const APP_ROUTES = {
  LOGIN: "/login",
  /** 기사님(mover) 전용 로그인 */
  MOVER_LOGIN: "/mover/login",
  /** 고객 이메일 회원가입 */
  SIGN_UP: "/signup",
  /** 기사님 이메일 회원가입 */
  MOVER_SIGN_UP: "/mover/signup",
  /** 고객 프로필 등록 */
  PROFILE: "/profile",
  /** 기사님 프로필 등록 */
  MOVER_PROFILE: "/mover/profile",
  /** 견적 요청 */
  ESTIMATE_REQUEST: "/estimate-request",
  /** 프로필 수정 — 추후 페이지 연동 */
  PROFILE_EDIT: "/profile/edit",
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
  // 2026.07.30 정슬기 - [추가] 내 견적 관리 페이지 경로
  /** 내 견적 관리 */
  ESTIMATES: {
    ROOT: "/estimates",
    PENDING: "/estimates/pending",
    RECEIVED: "/estimates/received",
    REQUESTS: "/estimates/requests",
    REQUEST_DETAIL: (estimateRequestId: number) => `/estimates/requests/${estimateRequestId}`,
    DETAIL: (estimateId: number) => `/estimates/${estimateId}`,
    PENDING_DETAIL: (estimateId: number) => `/estimates/pending/${estimateId}`,
  },
} as const;
