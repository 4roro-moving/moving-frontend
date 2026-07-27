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
    ALL: ["estimateRequests"] as const,
    ACTIVE: ["estimateRequests", "active"] as const,
    DETAIL: (requestId: number) => ["estimateRequests", requestId] as const,
    // 2026.07.25 정슬기 - [추가] 내 견적 요청 목록 쿼리 키
    MY_LIST: ["estimateRequests", "mine"] as const,
  },

  // 2026.07.24 정슬기 - [추가] 받은 견적 목록·상세 React Query 키
  ESTIMATES: {
    ALL: ["estimates"],
    RECEIVED: ["estimates", "received"] as const,
    DETAIL_ROOT: ["estimates", "detail"] as const,
    DETAIL: (estimateId: number) => ["estimates", "detail", estimateId] as const,
    // 2026.07.25 정슬기 - [추가] 대기 견적 상세(mock ViewModel) 쿼리 키
    // 2026.07.26 정슬기 - [수정] PENDING_DETAIL_ROOT로 prefix invalidate/낙관적 업데이트 지원
    PENDING_DETAIL_ROOT: ["estimates", "pending", "detail"] as const,
    PENDING_DETAIL: (estimateId: number) => ["estimates", "pending", "detail", estimateId] as const,
  },

  /**
   * 전용 찜 목록 API 연동 시 사용 예정.
   * 현재 찜 상태는 견적 목록/상세 캐시(mover.isFavorite)에서 낙관적으로 관리합니다.
   * // 2026.07.26 정슬기 - [수정] 미사용 키 용도 주석
   */
  FAVORITES: {
    MOVER: (moverId: string) => ["favorites", "mover", moverId] as const,
  },

  // 2026.07.25 정슬기 - [추가] 리뷰 쿼리 키
  REVIEWS: {
    ALL: ["reviews"] as const,
    ME: ["reviews", "me"] as const,
    REVIEWABLE: ["reviews", "reviewable"] as const,
  },

  NOTIFICATIONS: {
    ALL: ["notifications"],
  },
} as const;
