export const API_ROUTES = {
  AUTH: {
    SIGN_UP_CUSTOMER: "/auth/signup/customer",
    SIGN_UP_MOVER: "/auth/signup/mover",
    LOGIN: "/auth/login",
    LOGOUT: "/auth/logout",
    REFRESH: "/auth/refresh",
  },
  USERS: {
    ROOT: "/users",
    ME: "/users/me",
  },
  PROFILES: {
    ROOT: "/profiles",
    CUSTOMER_STATUS: "/profiles/customer/status",
    CUSTOMER_ME: "/profiles/customer/me",
    MOVER_STATUS: "/profiles/mover/status",
    MOVER_ME: "/profiles/mover/me",
  },
  MOVERS: {
    ROOT: "/movers",
    DETAIL: (moverId: string) => `/movers/${moverId}`,
    REVIEWS: (moverId: string) => `/movers/${moverId}/reviews`,
  },
  ESTIMATE_REQUESTS: {
    ROOT: "/estimate-requests",
    DETAIL: (estimateRequestId: number) => `/estimate-requests/${estimateRequestId}`,
    ACTIVE: "/estimate-requests/active",
    DESIGNATE: (estimateRequestId: number) => `/estimate-requests/${estimateRequestId}/designate`,
  },
  // 2026.07.24 정슬기 - [추가] 받은 견적 목록·상세·확정 API 경로
  // 2026.07.28 정슬기 - [수정] 대기 중인 견적 목록 경로 추가 (BE GET /estimates/pending)
  ESTIMATES: {
    ROOT: "/estimates",
    PENDING: "/estimates/pending",
    RECEIVED: "/estimates/received",
    DETAIL: (estimateId: number) => `/estimates/${estimateId}`,
    CONFIRM: (estimateId: number) => `/estimates/${estimateId}/confirm`,
  },
  FAVORITES: {
    /** GET 찜한 기사님 목록 */
    MOVERS: "/favorites/movers",
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
