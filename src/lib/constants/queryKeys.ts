import type { MoversListQuery } from "@/types/mover";

/**
 * 사용자별 응답(`isFavorite`)이 React Query 캐시에서 섞이지 않도록 사용하는 인증 scope
 *
 * - guest: 비회원 및 서버 prefetch
 * - authenticated-unresolved: 인증 상태지만 사용자 ID를 확인하지 못한 상태
 * - user:{userId}: 사용자 식별이 완료된 로그인 상태
 *
 * authenticated-unresolved 상태에서는 사용자별 쿼리를 실행하지 않습니다.
 */
export const AUTH_QUERY_GUEST_SCOPE = "guest" as const;
export const AUTH_QUERY_UNRESOLVED_SCOPE = "authenticated-unresolved" as const;

export const getAuthQueryScope = (isAuthenticated: boolean, userId?: string | null) => {
  if (!isAuthenticated) {
    return AUTH_QUERY_GUEST_SCOPE;
  }

  return userId ? (`user:${userId}` as const) : AUTH_QUERY_UNRESOLVED_SCOPE;
};

export type AuthQueryScope = ReturnType<typeof getAuthQueryScope>;

/**
 * 현재 사용자의 모든 기사님 목록 쿼리를 대상으로 하는 prefix.
 * 찜 mutation의 cancel·snapshot·낙관적 업데이트 범위를 제한할 때 사용합니다.
 */
export const getMoverListScopeQueryKey = (authScope: AuthQueryScope) =>
  [...QUERY_KEYS.MOVERS.LIST, authScope] as const;

/** 필터 조건까지 포함한 기사님 목록의 실제 Query Key */
export const getMoverListQueryKey = (
  authScope: AuthQueryScope,
  query: Omit<MoversListQuery, "page">,
) => [...getMoverListScopeQueryKey(authScope), query] as const;

/**
 * 현재 사용자의 유한·무한 찜 목록을 함께 대상으로 하는 prefix.
 * 다른 사용자의 찜 캐시를 낙관적으로 수정하지 않도록 사용합니다.
 */
export const getFavoriteMoversScopeQueryKey = (authScope: AuthQueryScope) =>
  [...QUERY_KEYS.FAVORITES.MOVERS, authScope] as const;

/**
 * 기사 상세의 사용자별 Query Key.
 * SSR prefetch에서는 guest scope를 사용합니다.
 */
export const getMoverDetailQueryKey = (authScope: AuthQueryScope, moverId: string) =>
  [...QUERY_KEYS.MOVERS.DETAIL_ROOT, authScope, moverId] as const;

/** 현재 사용자의 모든 기사 상세 쿼리를 대상으로 하는 prefix. */
export const getMoverDetailScopeQueryKey = (authScope: AuthQueryScope) =>
  [...QUERY_KEYS.MOVERS.DETAIL_ROOT, authScope] as const;

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
    DETAIL_ROOT: ["movers", "detail"] as const,
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
    SENT_LIST_ROOT: ["estimates", "sent", "list"] as const,
    SENT_LIST: (status?: string) => ["estimates", "sent", "list", { status }] as const,
    // DETAIL_ROOT(["estimates","detail"])와 접두사가 다름 — 취소 시 별도 invalidate 필요
    // 2026.08.04 정슬기 - [추가]
    SENT_DETAIL_ROOT: ["estimates", "sent", "detail"] as const,
    SENT_DETAIL: (estimateId: number) => ["estimates", "sent", "detail", estimateId] as const,
    RECEIVED: ["estimates", "received"] as const,
    // 받았던/대기 상세 모두 GET /estimates/:estimateId — 동일 DETAIL 키 공유
    // 2026.07.29 정슬기 - [수정] PENDING_DETAIL 제거, DETAIL로 통합
    //2026.07.28 윤소정 - [추가] 기사 반려 내역 조회
    REJECTED: ["estimates", "rejected"] as const,
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
    MOVERS_LIST: (authScope: AuthQueryScope, limit: number) =>
      [...getFavoriteMoversScopeQueryKey(authScope), { limit }] as const,
    MOVERS_INFINITE: (authScope: AuthQueryScope, limit: number) =>
      [...getFavoriteMoversScopeQueryKey(authScope), "infinite", { limit }] as const,
    MOVER: (moverId: string) => ["favorites", "mover", moverId] as const,
  },

  // 2026.07.25 정슬기 - [추가] 리뷰 쿼리 키
  // 2026.07.30 정슬기 - [수정] 견적 관리와 동일하게 ROOT·페이지 팩토리 분리
  REVIEWS: {
    ALL: ["reviews"] as const,
    REVIEWABLE: ["reviews", "reviewable"] as const,
    ME_ROOT: ["reviews", "me"] as const,
    ME: (page: number, limit: number) => ["reviews", "me", { page, limit }] as const,
    BY_MOVER_ROOT: (moverId: string) => ["reviews", "mover", moverId] as const,
    BY_MOVER: (moverId: string, page: number, limit: number) =>
      ["reviews", "mover", moverId, { page, limit }] as const,
  },

  NOTIFICATIONS: {
    ALL: ["notifications"] as const,
    LIST_ROOT: ["notifications", "list"] as const,
    LIST: (page: number, limit: number) => ["notifications", "list", { page, limit }] as const,
    UNREAD_COUNT: ["notifications", "unread-count"] as const,
  },
} as const;
