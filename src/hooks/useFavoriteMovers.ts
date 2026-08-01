"use client";

import { useMemo } from "react";

import { useAuthQueryScope } from "@/hooks/useAuthQueryScope";
import { useCustomerAuthReady } from "@/hooks/useCustomerAuthReady";
import { useApiInfiniteQuery } from "@/hooks/queries/useApiInfiniteQuery";
import { useApiQuery } from "@/hooks/queries/useApiQuery";
import { getFavoriteMovers, FAVORITE_MOVERS_PAGE_LIMIT } from "@/lib/api/favorites";
import { QUERY_KEYS } from "@/lib/constants/queryKeys";
import { mapMoverListItemToMover } from "@/lib/utils/mapMover";

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
  const { authScope, isAuthQueryReady } = useAuthQueryScope();
  const auth = useCustomerAuthReady();
  const enabled = (options.enabled ?? true) && auth.canFetch && isAuthQueryReady;

  const query = useApiQuery({
    queryKey: QUERY_KEYS.FAVORITES.MOVERS_LIST(authScope, limit),
    queryFn: () => getFavoriteMovers({ limit }),
    enabled,
  });

  const movers = useMemo(() => query.data?.data.map(mapMoverListItemToMover) ?? [], [query.data]);

  return {
    auth,
    isInitialLoading: auth.isPending || (enabled && query.isPending),
    movers,
    query,
  };
}

/** GET /favorites/movers — 찜한 기사님 목록 페이지 (더보기 / infinite) */
export function useFavoriteMoversInfinite(options: UseFavoriteMoversInfiniteOptions = {}) {
  const limit = options.limit ?? FAVORITE_MOVERS_PAGE_LIMIT;
  const { authScope, isAuthQueryReady } = useAuthQueryScope();
  const auth = useCustomerAuthReady();
  const enabled = (options.enabled ?? true) && auth.canFetch && isAuthQueryReady;

  const query = useApiInfiniteQuery({
    queryKey: QUERY_KEYS.FAVORITES.MOVERS_INFINITE(authScope, limit),
    queryFn: ({ pageParam }) => getFavoriteMovers({ cursor: pageParam, limit }),
    initialPageParam: undefined as string | undefined,
    getNextPageParam: (lastPage) =>
      lastPage.pagination.hasNext ? (lastPage.pagination.nextCursor ?? undefined) : undefined,
    enabled,
  });

  const movers = useMemo(
    () => query.data?.pages.flatMap((page) => page.data.map(mapMoverListItemToMover)) ?? [],
    [query.data],
  );

  return {
    auth,
    isInitialLoading: auth.isPending || (enabled && query.isPending),
    movers,
    query,
    totalCount: query.data?.pages[0]?.pagination.totalCount ?? 0,
  };
}
