"use client";

import { useMemo } from "react";

import { useApiInfiniteQuery } from "@/hooks/queries/useApiInfiniteQuery";
import { useAuthQueryScope } from "@/hooks/useAuthQueryScope";
import { getResidenceReviewsInfiniteQueryOptions } from "@/lib/queryOptions/residenceReviews";
import { toResidenceReviewListQuery } from "@/lib/utils/residenceReviewSearchParams";
import type { ResidenceReviewSearchParamsState } from "@/lib/utils/residenceReviewSearchParams";
import { useAuthStore } from "@/stores/useAuthStore";

export const useResidenceReviews = (filters: ResidenceReviewSearchParamsState) => {
  const listQuery = toResidenceReviewListQuery(filters);
  const hasHydrated = useAuthStore((state) => state.hasHydrated);
  const isCheckingAuth = useAuthStore((state) => state.isCheckingAuth);
  const isAuthReady = hasHydrated && !isCheckingAuth;
  const { authScope, isAuthQueryReady } = useAuthQueryScope();

  const query = useApiInfiniteQuery({
    ...getResidenceReviewsInfiniteQueryOptions(authScope, listQuery),
    enabled: isAuthReady && isAuthQueryReady,
  });

  const reviews = useMemo(() => query.data?.pages.flatMap((page) => page.data) ?? [], [query.data]);
  const isInitialLoading = !isAuthReady || !isAuthQueryReady || query.isPending;

  return { reviews, isInitialLoading, query };
};
