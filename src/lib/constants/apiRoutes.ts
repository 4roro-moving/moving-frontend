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
  ESTIMATE_REQUESTS: {
    ROOT: "/estimate-requests",
    DETAIL: (estimateRequestId: number) => `/estimate-requests/${estimateRequestId}`,
  },
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
  // 2026.07.25 정슬기 - [추가] 리뷰 API 경로
  REVIEWS: {
    ROOT: "/reviews",
    ME: "/reviews/me",
    REVIEWABLE: "/reviews/reviewable",
  },
  NOTIFICATIONS: "/notifications",
} as const;
