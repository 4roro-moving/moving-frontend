export const API_ROUTES = {
  AUTH: {
    SIGN_UP: "/auth/signup",
    SIGN_IN: "/auth/signin",
    /** 백엔드 실제 로그인 경로. 개발 전용 로그인에서 사용 */
    LOGIN: "/auth/login",
    SIGN_OUT: "/auth/logout",
    REFRESH: "/auth/refresh",
    ME: "/auth/me",
  },
  USERS: "/users",
  PROFILES: "/profiles",
  MOVERS: "/movers",
  ESTIMATE_REQUESTS: "/estimate-requests",
  // 2026.07.24 정슬기 - [추가] 받은 견적 목록·상세·확정 API 경로
  ESTIMATES: {
    ROOT: "/estimates",
    RECEIVED: "/estimates/received",
    DETAIL: (estimateId: number) => `/estimates/${estimateId}`,
    CONFIRM: (estimateId: number) => `/estimates/${estimateId}/confirm`,
  },
  FAVORITES: {
    MOVER: (moverId: string) => `/favorites/movers/${moverId}`,
  },
  REVIEWS: "/reviews",
  NOTIFICATIONS: "/notifications",
} as const;
