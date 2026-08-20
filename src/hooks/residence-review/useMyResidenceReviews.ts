"use client";

import { keepPreviousData } from "@tanstack/react-query";

import { useApiQuery } from "@/hooks/queries/useApiQuery";
import { useAuthQueryScope } from "@/hooks/useAuthQueryScope";
import { useCustomerAuthReady } from "@/hooks/useCustomerAuthReady";
import { RESIDENCE_REVIEW_PAGE_LIMIT } from "@/lib/constants/residenceReview";
import { getMyResidenceReviewsQueryOptions } from "@/lib/queryOptions/residenceReviews";

interface UseMyResidenceReviewsParams {
  page: number;
  limit?: number;
}

export const useMyResidenceReviews = ({
  page,
  limit = RESIDENCE_REVIEW_PAGE_LIMIT,
}: UseMyResidenceReviewsParams) => {
  const { canFetch } = useCustomerAuthReady();
  const { authScope, isAuthQueryReady } = useAuthQueryScope();

  return useApiQuery({
    ...getMyResidenceReviewsQueryOptions(authScope, page, limit),
    placeholderData: keepPreviousData,
    enabled: canFetch && isAuthQueryReady,
  });
};
