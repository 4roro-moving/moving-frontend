"use client";

import { useCursorListQuery } from "@/hooks/queries/useCursorListQuery";
import { useAuthQueryScope } from "@/hooks/useAuthQueryScope";
import { getGiveawaysInfiniteQueryOptions } from "@/lib/queryOptions/giveaways";
import { toGiveawayListQuery } from "@/lib/utils/giveawaySearchParams";
import type { GiveawaySearchParamsState } from "@/lib/utils/giveawaySearchParams";

export const useGiveaways = (filters: GiveawaySearchParamsState) => {
  const { authScope, isAuthQueryReady } = useAuthQueryScope();
  const listQuery = toGiveawayListQuery(filters);

  const {
    items: giveaways,
    isInitialLoading,
    isFilterFetching,
    query,
  } = useCursorListQuery({
    ...getGiveawaysInfiniteQueryOptions(authScope, listQuery),
    enabled: isAuthQueryReady,
  });

  return { giveaways, isInitialLoading, isFilterFetching, query };
};
