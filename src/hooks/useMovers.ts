"use client";

import { getMovers } from "@/lib/api/movers";
import { hasAuthSession } from "@/lib/auth/session";
import { QUERY_KEYS } from "@/lib/constants/queryKeys";
import { toMoversListQuery, type MoversSearchParamsState } from "@/lib/utils/moversSearchParams";
import { useApiInfiniteQuery } from "@/hooks/queries/useApiInfiniteQuery";
import { useIsClient } from "@/hooks/useIsClient";

const MOVERS_LIST_STALE_TIME_MS = 60 * 1000;

export function useMovers(filters: MoversSearchParamsState) {
  const listQuery = toMoversListQuery(filters);
  const isClient = useIsClient();
  // SSR prefetch는 서버에 access token이 없어 비회원 응답일 수 있음 → 로그인 시 즉시 재검증
  const staleTime = isClient && hasAuthSession() ? 0 : MOVERS_LIST_STALE_TIME_MS;

  return useApiInfiniteQuery({
    queryKey: [...QUERY_KEYS.MOVERS.LIST, listQuery],
    queryFn: ({ pageParam }) => getMovers({ ...listQuery, page: pageParam }),
    initialPageParam: 1,
    getNextPageParam: (lastPage) =>
      lastPage.pagination.hasNext ? lastPage.pagination.page + 1 : undefined,
    staleTime,
  });
}
