import { infiniteQueryOptions } from "@tanstack/react-query";

import { getMovers } from "@/lib/api/movers";
import { getMoverListQueryKey, type AuthQueryScope } from "@/lib/constants/queryKeys";
import type { MoversListQuery } from "@/types/mover";

/** 비회원 기사님 목록 캐시 유지 시간 */
export const MOVERS_LIST_STALE_TIME_MS = 60 * 1000;

export function getMoversInfiniteQueryOptions(
  authScope: AuthQueryScope,
  listQuery: Omit<MoversListQuery, "page">,
) {
  return infiniteQueryOptions({
    queryKey: getMoverListQueryKey(authScope, listQuery),
    queryFn: ({ pageParam }) => getMovers({ ...listQuery, page: pageParam }),
    initialPageParam: 1,
    getNextPageParam: (lastPage) =>
      lastPage.pagination.hasNext ? lastPage.pagination.page + 1 : undefined,
  });
}
