"use client";

import { getMovers } from "@/lib/api/movers";
import { getMoverListQueryKey } from "@/lib/constants/queryKeys";
import { toMoversListQuery, type MoversSearchParamsState } from "@/lib/utils/moversSearchParams";
import { useAuthQueryScope } from "@/hooks/useAuthQueryScope";
import { useApiInfiniteQuery } from "@/hooks/queries/useApiInfiniteQuery";
import { useAuthStore } from "@/stores/useAuthStore";

const MOVERS_LIST_STALE_TIME_MS = 60 * 1000;

export function useMovers(filters: MoversSearchParamsState) {
  const listQuery = toMoversListQuery(filters);
  const hasHydrated = useAuthStore((state) => state.hasHydrated);
  const isCheckingAuth = useAuthStore((state) => state.isCheckingAuth);
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const isAuthReady = hasHydrated && !isCheckingAuth;
  const authScope = useAuthQueryScope();

  return useApiInfiniteQuery({
    queryKey: getMoverListQueryKey(authScope, listQuery),
    queryFn: ({ pageParam }) => getMovers({ ...listQuery, page: pageParam }),
    initialPageParam: 1,
    getNextPageParam: (lastPage) =>
      lastPage.pagination.hasNext ? lastPage.pagination.page + 1 : undefined,
    enabled: isAuthReady,
    // 로그인 응답의 isFavorite는 세션 복구 직후 항상 서버에서 다시 확인합니다.
    staleTime: isAuthenticated ? 0 : MOVERS_LIST_STALE_TIME_MS,
  });
}
