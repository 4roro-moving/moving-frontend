"use client";

import { keepPreviousData } from "@tanstack/react-query";
import { useMemo } from "react";

import { useApiInfiniteQuery } from "@/hooks/queries/useApiInfiniteQuery";
import { useAuthQueryScope } from "@/hooks/useAuthQueryScope";
import { getGiveawaysInfiniteQueryOptions } from "@/lib/queryOptions/giveaways";
import { toGiveawayListQuery } from "@/lib/utils/giveawaySearchParams";
import type { GiveawaySearchParamsState } from "@/lib/utils/giveawaySearchParams";

export const useGiveaways = (filters: GiveawaySearchParamsState) => {
  const { authScope, isAuthQueryReady } = useAuthQueryScope();
  const listQuery = toGiveawayListQuery(filters);

  const query = useApiInfiniteQuery({
    ...getGiveawaysInfiniteQueryOptions(authScope, listQuery),
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
