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

function useFavoriteMoversQueryContext(requestEnabled = true) {
  const { authScope, isAuthQueryReady } = useAuthQueryScope();
  const auth = useCustomerAuthReady();
  const isCustomerLoggedIn = auth.canFetch;

  return {
    authScope,
    enabled: requestEnabled && isCustomerLoggedIn && isAuthQueryReady,
    isAuthPending: auth.isPending,
    isCustomerLoggedIn,
    shouldHideForMover: !auth.isPending && auth.isAuthenticated && auth.isMover,
  };
}

/** GET /favorites/movers — 로그인 고객의 찜한 기사님 목록 (사이드바 등 단일 페이지) */
export function useFavoriteMovers(options: UseFavoriteMoversOptions = {}) {
  const limit = options.limit ?? FAVORITE_MOVERS_PAGE_LIMIT;
  const authContext = useFavoriteMoversQueryContext(options.enabled);

  const query = useApiQuery({
    queryKey: QUERY_KEYS.FAVORITES.MOVERS_LIST(authContext.authScope, limit),
    queryFn: () => getFavoriteMovers({ limit }),
    enabled: authContext.enabled,
  });

  const movers = useMemo(() => query.data?.data.map(mapMoverListItemToMover) ?? [], [query.data]);

  return {
    isAuthPending: authContext.isAuthPending,
    isCustomerLoggedIn: authContext.isCustomerLoggedIn,
    isInitialLoading: authContext.isAuthPending || (authContext.enabled && query.isPending),
    movers,
    query,
    shouldHideForMover: authContext.shouldHideForMover,
  };
}

/** GET /favorites/movers — 찜한 기사님 목록 페이지 (더보기 / infinite) */
export function useFavoriteMoversInfinite(options: UseFavoriteMoversInfiniteOptions = {}) {
  const limit = options.limit ?? FAVORITE_MOVERS_PAGE_LIMIT;
  const authContext = useFavoriteMoversQueryContext(options.enabled);

  const query = useApiInfiniteQuery({
    queryKey: QUERY_KEYS.FAVORITES.MOVERS_INFINITE(authContext.authScope, limit),
    queryFn: ({ pageParam }) => getFavoriteMovers({ cursor: pageParam, limit }),
    initialPageParam: undefined as string | undefined,
    getNextPageParam: (lastPage) =>
      lastPage.pagination.hasNext ? (lastPage.pagination.nextCursor ?? undefined) : undefined,
    enabled: authContext.enabled,
  });

  const movers = useMemo(
    () => query.data?.pages.flatMap((page) => page.data.map(mapMoverListItemToMover)) ?? [],
    [query.data],
  );

  return {
    isAuthPending: authContext.isAuthPending,
    isCustomerLoggedIn: authContext.isCustomerLoggedIn,
    isInitialLoading: authContext.isAuthPending || (authContext.enabled && query.isPending),
    movers,
    query,
    shouldHideForMover: authContext.shouldHideForMover,
    totalCount: query.data?.pages[0]?.pagination.totalCount ?? 0,
  };
}
