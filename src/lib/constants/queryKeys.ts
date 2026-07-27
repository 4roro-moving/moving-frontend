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
    ACTIVE: ["estimateRequests", "active"],
    DETAIL: (requestId: number) => ["estimateRequests", requestId],
  },

  ESTIMATES: {
    ALL: ["estimates"],
    DETAIL: (estimateId: number) => ["estimates", estimateId],
  },

  REVIEWS: {
    ALL: ["reviews"],
  },

  NOTIFICATIONS: {
    ALL: ["notifications"],
  },
} as const;
