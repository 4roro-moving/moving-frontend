export const QUERY_KEYS = {
  AUTH: {
    ME: ["auth", "me"],
  },

  USERS: {
    ALL: ["users"],
    DETAIL: (userId: string) => ["users", userId],
  },

  MOVERS: {
    ALL: ["movers"],
    DETAIL: (moverId: string) => ["movers", moverId],
  },

  ESTIMATE_REQUESTS: {
    ALL: ["estimateRequests"],
    DETAIL: (requestId: number) => ["estimateRequests", requestId],
  },

  // 2026.07.24 정슬기 - [추가] 받은 견적 목록·상세 React Query 키
  ESTIMATES: {
    ALL: ["estimates"],
    RECEIVED: ["estimates", "received"] as const,
    DETAIL: (estimateId: number) => ["estimates", "detail", estimateId] as const,
  },

  FAVORITES: {
    MOVER: (moverId: string) => ["favorites", "mover", moverId] as const,
  },

  REVIEWS: {
    ALL: ["reviews"],
  },

  NOTIFICATIONS: {
    ALL: ["notifications"],
  },
} as const;
