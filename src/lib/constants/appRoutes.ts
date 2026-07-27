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
  /** 고객 프로필 등록 */
  PROFILE: "/profile",
  /** 견적 요청 */
  ESTIMATE_REQUEST: "/estimate-request",
  /** 기사님 찾기 */
  MOVERS: "/movers",
  /** 프로필 수정 — 추후 페이지 연동 */
  PROFILE_EDIT: "/profile/edit",
  /** 찜한 기사님 — 추후 페이지 연동 */
  FAVORITE_MOVERS: "/favorites",
  /** 이사 리뷰 — 추후 페이지 연동 */
  REVIEWS: "/reviews",
  DEV_LOGIN: "/dev-login",
} as const;
