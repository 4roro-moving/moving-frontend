"use client";

import { useCursorListQuery } from "@/hooks/queries/useCursorListQuery";
import { useAuthQueryScope } from "@/hooks/useAuthQueryScope";
import { getMyGiveawayRequestsInfiniteQueryOptions } from "@/lib/queryOptions/giveawayRequests";
import {
  toGiveawayRequestMyListQuery,
  type GiveawayRequestFilterState,
} from "@/lib/utils/giveawayRequestSearchParams";

export const useMyGiveawayRequests = (filters: GiveawayRequestFilterState) => {
  const { authScope, isAuthQueryReady } = useAuthQueryScope();
  const listQuery = toGiveawayRequestMyListQuery(filters);

  const {
    items: requests,
    isInitialLoading,
    isFilterFetching,
    query,
  } = useCursorListQuery({
    ...getMyGiveawayRequestsInfiniteQueryOptions(authScope, listQuery),
    enabled: isAuthQueryReady,
  });

  return { requests, isInitialLoading, isFilterFetching, query };
};
