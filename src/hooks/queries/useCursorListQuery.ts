"use client";

import {
  keepPreviousData,
  type InfiniteData,
  type QueryKey,
  type UseInfiniteQueryOptions,
} from "@tanstack/react-query";
import { useMemo } from "react";

import { useApiInfiniteQuery } from "@/hooks/queries/useApiInfiniteQuery";
import { useListLoadingState } from "@/hooks/queries/useListLoadingState";
import { ApiError } from "@/types/api";

export const useCursorListQuery = <
  TPage extends { data: readonly unknown[] },
  TQueryKey extends QueryKey = QueryKey,
>(
  options: UseInfiniteQueryOptions<
    TPage,
    ApiError,
    InfiniteData<TPage>,
    TQueryKey,
    string | undefined
  >,
) => {
  const query = useApiInfiniteQuery({
    ...options,
    placeholderData: keepPreviousData,
  });

  const items = useMemo(
    () => (query.data?.pages.flatMap((page) => page.data) ?? []) as TPage["data"],
    [query.data],
  );
  const { isInitialLoading, isPreviousDataLoading } = useListLoadingState(query);

  return { items, isInitialLoading, isFilterFetching: isPreviousDataLoading, query };
};
