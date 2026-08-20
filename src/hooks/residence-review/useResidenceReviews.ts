"use client";

import { keepPreviousData } from "@tanstack/react-query";
import { useMemo } from "react";

import { useApiInfiniteQuery } from "@/hooks/queries/useApiInfiniteQuery";
import { getResidenceReviewsInfiniteQueryOptions } from "@/lib/queryOptions/residenceReviews";
import { toResidenceReviewListQuery } from "@/lib/utils/residenceReviewSearchParams";
import type { ResidenceReviewSearchParamsState } from "@/lib/utils/residenceReviewSearchParams";

export const useResidenceReviews = (filters: ResidenceReviewSearchParamsState) => {
  const listQuery = toResidenceReviewListQuery(filters);

  const query = useApiInfiniteQuery({
    ...getResidenceReviewsInfiniteQueryOptions(listQuery),
    placeholderData: keepPreviousData,
  });

  const reviews = useMemo(() => query.data?.pages.flatMap((page) => page.data) ?? [], [query.data]);
  const isInitialLoading = query.isPending && query.data === undefined;
  const isFilterFetching = query.isFetching && query.isPlaceholderData;

  return { reviews, isInitialLoading, isFilterFetching, query };
};
