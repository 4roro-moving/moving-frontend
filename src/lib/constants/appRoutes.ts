/**
 * 프론트엔드 페이지 경로 상수
 * API 경로(`API_ROUTES`)와 분리합니다.
 * // 2026.07.25 정슬기 - [추가]
 */
export const APP_ROUTES = {
  /** 홈 */
  HOME: "/",
  LOGIN: "/login",
  /** 기사님(mover) 전용 로그인 */
  MOVER_LOGIN: "/mover/login",
  /** 고객 이메일 회원가입 */
  SIGN_UP: "/signup",
  /** 기사님 이메일 회원가입 */
  MOVER_SIGN_UP: "/mover/signup",
  /** OAuth 인가 code callback — `/oauth/{provider}/callback` */
  OAUTH_CALLBACK: (provider: "google" | "kakao" | "naver") => `/oauth/${provider}/callback`,
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
    // 2026.08.03 윤소정 - [추가] 지도기반 기사님 추천
    MAP: "/movers/map",
    DETAIL: (moverId: string) => `/movers/${moverId}`,
    /** 찜한 기사님 전체 목록 */
    FAVORITES: "/movers/favorites",
  },
  // 2026.07.27 정슬기 - [추가] 고객 리뷰 관리 페이지 경로
  REVIEWS: {
    ROOT: "/reviews",
    WRITABLE: "/reviews/writable",
    ME: "/reviews/me",
  },
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
  /** 기사님 받은 요청 및 내 견적 관리 */
  MOVER_ESTIMATES: {
    /** 기존 헤더 호환용 기본 진입 경로 */
    ROOT: "/estimate/received-requests",
    RECEIVED_REQUESTS: "/estimate/received-requests",
    SENT: "/estimate/sent",
    SENT_DETAIL: (estimateId: number) => `/estimate/sent/${estimateId}`,
    REJECTED: "/estimate/rejected",
  },
} as const;
