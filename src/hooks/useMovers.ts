"use client";

import { getMovers } from "@/lib/api/movers";
import { QUERY_KEYS } from "@/lib/constants/queryKeys";
import {
  MOVERS_ALL_VALUE,
  MOVERS_PAGE_LIMIT,
  type MoversSearchParamsState,
} from "@/lib/utils/moversSearchParams";
import { useApiInfiniteQuery } from "@/hooks/queries/useApiInfiniteQuery";
import type { MoveType } from "@/types/move";
import type { MoversListQuery } from "@/types/mover";

function toMoversListQuery(filters: MoversSearchParamsState): Omit<MoversListQuery, "page"> {
  return {
    keyword: filters.keyword.trim() || undefined,
    sort: filters.sort,
    serviceArea: filters.serviceArea !== MOVERS_ALL_VALUE ? filters.serviceArea : undefined,
    moveType: filters.moveType !== MOVERS_ALL_VALUE ? (filters.moveType as MoveType) : undefined,
    limit: MOVERS_PAGE_LIMIT,
  };
}

export function useMovers(filters: MoversSearchParamsState) {
  const listQuery = toMoversListQuery(filters);

  return useApiInfiniteQuery({
    queryKey: [...QUERY_KEYS.MOVERS.LIST, listQuery],
    queryFn: ({ pageParam }) => getMovers({ ...listQuery, page: pageParam }),
    initialPageParam: 1,
    getNextPageParam: (lastPage) =>
      lastPage.pagination.hasNext ? lastPage.pagination.page + 1 : undefined,
  });
}
