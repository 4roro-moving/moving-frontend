"use client";

import { getFavoriteMovers, FAVORITE_MOVERS_PAGE_LIMIT } from "@/lib/api/favorites";
import { QUERY_KEYS } from "@/lib/constants/queryKeys";
import { useApiInfiniteQuery } from "@/hooks/queries/useApiInfiniteQuery";
import { useApiQuery } from "@/hooks/queries/useApiQuery";
import { useAuthQueryScope } from "@/hooks/useAuthQueryScope";

interface UseFavoriteMoversOptions {
  limit?: number;
  enabled?: boolean;
}

interface UseFavoriteMoversInfiniteOptions {
  limit?: number;
  enabled?: boolean;
}

/** GET /favorites/movers — 로그인 고객의 찜한 기사님 목록 (사이드바 등 단일 페이지) */
export function useFavoriteMovers(options: UseFavoriteMoversOptions = {}) {
  const limit = options.limit ?? FAVORITE_MOVERS_PAGE_LIMIT;
  const authScope = useAuthQueryScope();
  // hasAuthSession()은 SSR에서 false라 기본값으로 쓰지 않음. 호출부에서 명시.
  const enabled = options.enabled ?? false;

  return useApiQuery({
    queryKey: QUERY_KEYS.FAVORITES.MOVERS_LIST(authScope, limit),
    queryFn: () => getFavoriteMovers({ limit }),
    enabled,
  });
}

/** GET /favorites/movers — 찜한 기사님 목록 페이지 (더보기 / infinite) */
export function useFavoriteMoversInfinite(options: UseFavoriteMoversInfiniteOptions = {}) {
  const limit = options.limit ?? FAVORITE_MOVERS_PAGE_LIMIT;
  const authScope = useAuthQueryScope();
  const enabled = options.enabled ?? false;

  return useApiInfiniteQuery({
    queryKey: QUERY_KEYS.FAVORITES.MOVERS_INFINITE(authScope, limit),
    queryFn: ({ pageParam }) => getFavoriteMovers({ cursor: pageParam, limit }),
    initialPageParam: undefined as string | undefined,
    getNextPageParam: (lastPage) =>
      lastPage.pagination.hasNext ? (lastPage.pagination.nextCursor ?? undefined) : undefined,
    enabled,
  });
}
