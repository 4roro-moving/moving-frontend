"use client";

import { keepPreviousData } from "@tanstack/react-query";
import { useMemo } from "react";

import { useApiInfiniteQuery } from "@/hooks/queries/useApiInfiniteQuery";
import { useAuthQueryScope } from "@/hooks/useAuthQueryScope";
import { getMyGiveawaysInfiniteQueryOptions } from "@/lib/queryOptions/giveaways";
import {
  toMyGiveawayListQuery,
  type GiveawayMyFilterState,
} from "@/lib/utils/giveawaySearchParams";

export const useMyGiveaways = (filters: GiveawayMyFilterState) => {
  const { authScope, isAuthQueryReady } = useAuthQueryScope();
  const listQuery = toMyGiveawayListQuery(filters);

  const query = useApiInfiniteQuery({
    ...getMyGiveawaysInfiniteQueryOptions(authScope, listQuery),
    enabled: isAuthQueryReady,
    placeholderData: keepPreviousData,
  });

  const giveaways = useMemo(
    () => query.data?.pages.flatMap((page) => page.data) ?? [],
    [query.data],
  );
  const isInitialLoading = query.isPending && query.data === undefined;
  const isFilterFetching = query.isFetching && query.isPlaceholderData;

  return { giveaways, isInitialLoading, isFilterFetching, query };
};
