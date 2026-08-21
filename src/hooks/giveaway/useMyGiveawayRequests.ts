"use client";

import { keepPreviousData } from "@tanstack/react-query";
import { useMemo } from "react";

import { useApiInfiniteQuery } from "@/hooks/queries/useApiInfiniteQuery";
import { useAuthQueryScope } from "@/hooks/useAuthQueryScope";
import { getMyGiveawayRequestsInfiniteQueryOptions } from "@/lib/queryOptions/giveawayRequests";
import {
  toGiveawayRequestMyListQuery,
  type GiveawayRequestFilterState,
} from "@/lib/utils/giveawayRequestSearchParams";

export const useMyGiveawayRequests = (filters: GiveawayRequestFilterState) => {
  const { authScope, isAuthQueryReady } = useAuthQueryScope();
  const listQuery = toGiveawayRequestMyListQuery(filters);

  const query = useApiInfiniteQuery({
    ...getMyGiveawayRequestsInfiniteQueryOptions(authScope, listQuery),
    enabled: isAuthQueryReady,
    placeholderData: keepPreviousData,
  });

  const requests = useMemo(
    () => query.data?.pages.flatMap((page) => page.data) ?? [],
    [query.data],
  );
  const isInitialLoading = query.isPending && query.data === undefined;
  const isFilterFetching = query.isFetching && query.isPlaceholderData;

  return { requests, isInitialLoading, isFilterFetching, query };
};
