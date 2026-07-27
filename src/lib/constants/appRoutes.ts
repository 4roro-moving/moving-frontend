/**
 * 프론트엔드 페이지 경로 상수
 * API 경로(`API_ROUTES`)와 분리합니다.
 * // 2026.07.25 정슬기 - [추가]
 */
export const APP_ROUTES = {
  LOGIN: "/login",
  /** 기사님(mover) 전용 로그인 — 추후 구현 */
  MOVER_LOGIN: "/mover/login",
  /** 고객 이메일 회원가입 */
  SIGN_UP: "/signup",
  DEV_LOGIN: "/dev-login",
} as const;
