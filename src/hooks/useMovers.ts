"use client";

import { getMovers } from "@/lib/api/movers";
import { QUERY_KEYS } from "@/lib/constants/queryKeys";
import { toMoversListQuery, type MoversSearchParamsState } from "@/lib/utils/moversSearchParams";
import { useApiInfiniteQuery } from "@/hooks/queries/useApiInfiniteQuery";
import { useAuthStore } from "@/stores/useAuthStore";

const MOVERS_LIST_STALE_TIME_MS = 60 * 1000;

export function useMovers(filters: MoversSearchParamsState) {
  const listQuery = toMoversListQuery(filters);
  const hasHydrated = useAuthStore((state) => state.hasHydrated);
  const isCheckingAuth = useAuthStore((state) => state.isCheckingAuth);
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const isAuthReady = hasHydrated && !isCheckingAuth;
  const authScope = isAuthenticated ? "authenticated" : "guest";

  return useApiInfiniteQuery({
    queryKey: [...QUERY_KEYS.MOVERS.LIST, authScope, listQuery],
    queryFn: ({ pageParam }) => getMovers({ ...listQuery, page: pageParam }),
    initialPageParam: 1,
    getNextPageParam: (lastPage) =>
      lastPage.pagination.hasNext ? lastPage.pagination.page + 1 : undefined,
    enabled: isAuthReady,
    // 로그인 응답의 isFavorite는 세션 복구 직후 항상 서버에서 다시 확인합니다.
    staleTime: isAuthenticated ? 0 : MOVERS_LIST_STALE_TIME_MS,
  });
}
