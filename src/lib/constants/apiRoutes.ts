export const API_ROUTES = {
  AUTH: {
    SIGN_UP_CUSTOMER: "/auth/signup/customer",
    SIGN_UP_MOVER: "/auth/signup/mover",
    LOGIN: "/auth/login",
    LOGOUT: "/auth/logout",
    REFRESH: "/auth/refresh",
  },
  USERS: "/users",
  PROFILES: "/profiles",
  MOVERS: "/movers",
  ESTIMATE_REQUESTS: "/estimate-requests",
  ESTIMATE_REQUEST_ACTIVE: "/estimate-requests/active",
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
