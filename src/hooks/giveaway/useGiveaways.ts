"use client";

import { useCursorListQuery } from "@/hooks/queries/useCursorListQuery";
import { getGiveawaysInfiniteQueryOptions } from "@/lib/queryOptions/giveaways";
import {
  toGiveawayListQuery,
  type GiveawaySearchParamsState,
} from "@/lib/utils/giveawaySearchParams";

export const useGiveaways = (filters: GiveawaySearchParamsState) => {
  const listQuery = toGiveawayListQuery(filters);

  const {
    items: giveaways,
    isInitialLoading,
    isFilterFetching,
    query,
  } = useCursorListQuery({
    ...getGiveawaysInfiniteQueryOptions(listQuery),
  });

  return { giveaways, isInitialLoading, isFilterFetching, query };
};
