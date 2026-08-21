"use client";

import { useCursorListQuery } from "@/hooks/queries/useCursorListQuery";
import { useAuthQueryScope } from "@/hooks/useAuthQueryScope";
import { getMyGiveawaysInfiniteQueryOptions } from "@/lib/queryOptions/giveaways";
import {
  toMyGiveawayListQuery,
  type GiveawayMyFilterState,
} from "@/lib/utils/giveawaySearchParams";

export const useMyGiveaways = (filters: GiveawayMyFilterState) => {
  const { authScope, isAuthQueryReady } = useAuthQueryScope();
  const listQuery = toMyGiveawayListQuery(filters);

  const {
    items: giveaways,
    isInitialLoading,
    isFilterFetching,
    query,
  } = useCursorListQuery({
    ...getMyGiveawaysInfiniteQueryOptions(authScope, listQuery),
    enabled: isAuthQueryReady,
  });

  return { giveaways, isInitialLoading, isFilterFetching, query };
};
