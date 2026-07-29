export const QUERY_KEYS = {
  AUTH: {
    ME: ["auth", "me"],
  },

  USERS: {
    ALL: ["users"],
    DETAIL: (userId: string) => ["users", userId],
  },

  MOVERS: {
    ALL: ["movers"] as const,
    LIST: ["movers", "list"] as const,
    DETAIL: (moverId: string) => ["movers", "detail", moverId] as const,
  },

  ESTIMATE_REQUESTS: {
    ALL: ["estimateRequests"] as const,
    ACTIVE: ["estimateRequests", "active"] as const,
    DETAIL: (requestId: number) => ["estimateRequests", requestId] as const,
    // 2026.07.25 정슬기 - [추가] 내 견적 요청 목록 쿼리 키
    // 2026.07.29 정슬기 - [수정] page·limit 포함 — 보낸 견적 요청 목록 페이지네이션
    // 2026.07.29 정슬기 - [수정] status 포함 — 전체는 "all"
    MY_LIST_ROOT: ["estimateRequests", "mine"] as const,
    MY_LIST: (page: number, limit: number, status: string = "all") =>
      ["estimateRequests", "mine", { page, limit, status }] as const,
  },

  // 2026.07.24 정슬기 - [추가] 받은 견적 목록·상세 React Query 키
  ESTIMATES: {
    ALL: ["estimates"],
    RECEIVED: ["estimates", "received"] as const,
    // 받았던/대기 상세 모두 GET /estimates/:estimateId — 동일 DETAIL 키 공유
    // 2026.07.29 정슬기 - [수정] PENDING_DETAIL 제거, DETAIL로 통합
    DETAIL_ROOT: ["estimates", "detail"] as const,
    DETAIL: (estimateId: number) => ["estimates", "detail", estimateId] as const,
    // 2026.07.28 정슬기 - [수정] pending 목록 prefix (상세와 분리 — 찜 낙관적 업데이트 충돌 방지)
    // 2026.07.29 정슬기 - [수정] 사용처가 없던 PENDING_ROOT 제거
    PENDING_LIST_ROOT: ["estimates", "pending", "list"] as const,
    PENDING_LIST: (page: number, limit: number) =>
      ["estimates", "pending", "list", { page, limit }] as const,
  },

  FAVORITES: {
    ALL: ["favorites"] as const,
    /** GET /favorites/movers — 찜한 기사님 목록 */
    MOVERS: ["favorites", "movers"] as const,
    MOVER: (moverId: string) => ["favorites", "mover", moverId] as const,
  },

  // 2026.07.25 정슬기 - [추가] 리뷰 쿼리 키
  REVIEWS: {
    ALL: ["reviews"] as const,
    ME: ["reviews", "me"] as const,
    REVIEWABLE: ["reviews", "reviewable"] as const,
    BY_MOVER: (moverId: string) => ["reviews", "mover", moverId] as const,
  },

  NOTIFICATIONS: {
    ALL: ["notifications"],
  },
} as const;
