"use client";

import { useApiQuery } from "@/hooks/queries/useApiQuery";
import { useAuthQueryScope } from "@/hooks/useAuthQueryScope";
import { getResidenceReviewDetailQueryOptions } from "@/lib/queryOptions/residenceReviews";
import type { PublicResidenceReview } from "@/types/residenceReview";

interface UseResidenceReviewDetailParams {
  residenceReviewId: number | null;
  placeholderData?: PublicResidenceReview;
  enabled?: boolean;
}

export const useResidenceReviewDetail = ({
  residenceReviewId,
  placeholderData,
  enabled = true,
}: UseResidenceReviewDetailParams) => {
  const { authScope, isAuthQueryReady } = useAuthQueryScope();
  const queryOptions = getResidenceReviewDetailQueryOptions(authScope, residenceReviewId ?? 0);

  return useApiQuery({
    ...queryOptions,
    enabled: enabled && isAuthQueryReady && residenceReviewId !== null,
    placeholderData,
  });
};
