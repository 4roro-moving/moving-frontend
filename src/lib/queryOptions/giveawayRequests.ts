import { infiniteQueryOptions, queryOptions } from "@tanstack/react-query";

import { fetchGiveawayRequests, fetchMyGiveawayRequests } from "@/lib/api/giveawayRequests";
import { GIVEAWAY_LIST_STALE_TIME_MS } from "@/lib/constants/giveaway";
import {
  getGiveawayRequestMyListQueryKey,
  getGiveawayRequestsQueryKey,
  type AuthQueryScope,
} from "@/lib/constants/queryKeys";
import type { GiveawayRequestListQuery, GiveawayRequestMyListQuery } from "@/types/giveaway";

export const getGiveawayRequestsQueryOptions = (
  giveawayId: number,
  listQuery: Omit<GiveawayRequestListQuery, "cursor">,
) => {
  return queryOptions({
    queryKey: getGiveawayRequestsQueryKey(giveawayId, listQuery),
    queryFn: () => fetchGiveawayRequests(giveawayId, listQuery),
    staleTime: GIVEAWAY_LIST_STALE_TIME_MS,
  });
};

export const getMyGiveawayRequestsInfiniteQueryOptions = (
  authScope: AuthQueryScope,
  listQuery: Omit<GiveawayRequestMyListQuery, "cursor">,
) => {
  return infiniteQueryOptions({
    queryKey: getGiveawayRequestMyListQueryKey(authScope, listQuery),
    queryFn: ({ pageParam }) => fetchMyGiveawayRequests({ ...listQuery, cursor: pageParam }),
    initialPageParam: undefined as string | undefined,
    getNextPageParam: (lastPage) =>
      lastPage.pagination.hasNext ? (lastPage.pagination.nextCursor ?? undefined) : undefined,
    staleTime: GIVEAWAY_LIST_STALE_TIME_MS,
  });
};
