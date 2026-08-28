"use client";

import { keepPreviousData } from "@tanstack/react-query";
import { useMemo } from "react";

import { useAuthQueryScope } from "@/hooks/useAuthQueryScope";
import { useApiInfiniteQuery } from "@/hooks/queries/useApiInfiniteQuery";
import { useListLoadingState } from "@/hooks/queries/useListLoadingState";
import {
  MOVERS_LIST_STALE_TIME_MS,
  getMoversInfiniteQueryOptions,
} from "@/lib/queryOptions/movers";
import { mapMoverListItemToMover } from "@/lib/utils/mapMover";
import { toMoversListQuery, type MoversSearchParamsState } from "@/lib/utils/moversSearchParams";
import { useAuthStore } from "@/stores/useAuthStore";

export function useMovers(filters: MoversSearchParamsState) {
  const listQuery = toMoversListQuery(filters);
  const hasHydrated = useAuthStore((state) => state.hasHydrated);
  const isCheckingAuth = useAuthStore((state) => state.isCheckingAuth);
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const isAuthReady = hasHydrated && !isCheckingAuth;
  const { authScope, isAuthQueryReady } = useAuthQueryScope();

  const query = useApiInfiniteQuery({
    ...getMoversInfiniteQueryOptions(authScope, listQuery),
    enabled: isAuthReady && isAuthQueryReady,
    placeholderData: keepPreviousData,
    // 로그인 응답의 isFavorite는 세션 복구 직후 항상 서버에서 다시 확인
    staleTime: isAuthenticated ? 0 : MOVERS_LIST_STALE_TIME_MS,
  });

  const movers = useMemo(
    () => query.data?.pages.flatMap((page) => page.data).map(mapMoverListItemToMover) ?? [],
    [query.data],
  );
  const { isInitialLoading: isQueryInitialLoading, isPreviousDataLoading } =
    useListLoadingState(query);
  const isInitialLoading = !isAuthReady || !isAuthQueryReady || isQueryInitialLoading;

  return { movers, isInitialLoading, isFilterFetching: isPreviousDataLoading, query };
}
