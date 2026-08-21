import { infiniteQueryOptions } from "@tanstack/react-query";

import { fetchGiveaways } from "@/lib/api/giveaways";
import { GIVEAWAY_LIST_STALE_TIME_MS } from "@/lib/constants/giveaway";
import { getGiveawayListQueryKey, type AuthQueryScope } from "@/lib/constants/queryKeys";
import type { GiveawayListQuery } from "@/types/giveaway";

export const getGiveawaysInfiniteQueryOptions = (
  authScope: AuthQueryScope,
  listQuery: Omit<GiveawayListQuery, "cursor">,
) => {
  return infiniteQueryOptions({
    queryKey: getGiveawayListQueryKey(authScope, listQuery),
    queryFn: ({ pageParam }) => fetchGiveaways({ ...listQuery, cursor: pageParam }),
    initialPageParam: undefined as string | undefined,
    getNextPageParam: (lastPage) =>
      lastPage.pagination.hasNext ? (lastPage.pagination.nextCursor ?? undefined) : undefined,
    staleTime: GIVEAWAY_LIST_STALE_TIME_MS,
  });
};
