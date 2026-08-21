import { infiniteQueryOptions } from "@tanstack/react-query";

import { fetchGiveaways, fetchMyGiveaways } from "@/lib/api/giveaways";
import { GIVEAWAY_LIST_STALE_TIME_MS } from "@/lib/constants/giveaway";
import {
  getGiveawayListQueryKey,
  getGiveawayMyListQueryKey,
  type AuthQueryScope,
} from "@/lib/constants/queryKeys";
import type { GiveawayListQuery, GiveawayMyListQuery } from "@/types/giveaway";

export const getGiveawaysInfiniteQueryOptions = (listQuery: Omit<GiveawayListQuery, "cursor">) => {
  return infiniteQueryOptions({
    queryKey: getGiveawayListQueryKey(listQuery),
    queryFn: ({ pageParam }) => fetchGiveaways({ ...listQuery, cursor: pageParam }),
    initialPageParam: undefined as string | undefined,
    getNextPageParam: (lastPage) =>
      lastPage.pagination.hasNext ? (lastPage.pagination.nextCursor ?? undefined) : undefined,
    staleTime: GIVEAWAY_LIST_STALE_TIME_MS,
  });
};

export const getMyGiveawaysInfiniteQueryOptions = (
  authScope: AuthQueryScope,
  listQuery: Omit<GiveawayMyListQuery, "cursor">,
) => {
  return infiniteQueryOptions({
    queryKey: getGiveawayMyListQueryKey(authScope, listQuery),
    queryFn: ({ pageParam }) => fetchMyGiveaways({ ...listQuery, cursor: pageParam }),
    initialPageParam: undefined as string | undefined,
    getNextPageParam: (lastPage) =>
      lastPage.pagination.hasNext ? (lastPage.pagination.nextCursor ?? undefined) : undefined,
    staleTime: GIVEAWAY_LIST_STALE_TIME_MS,
  });
};
