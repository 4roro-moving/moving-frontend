"use client";

import { useQueryClient } from "@tanstack/react-query";

import { useApiMutation } from "@/hooks/queries/useApiMutation";
import { useAuthQueryScope } from "@/hooks/useAuthQueryScope";
import { deleteResidenceReview } from "@/lib/api/residenceReviews";
import { invalidateResidenceReviewRelatedQueries } from "@/lib/queryOptions/invalidateResidenceReviewQueries";

export const useDeleteResidenceReview = () => {
  const queryClient = useQueryClient();
  const { authScope } = useAuthQueryScope();

  return useApiMutation({
    mutationFn: deleteResidenceReview,
    onSuccess: (_data, residenceReviewId) => {
      invalidateResidenceReviewRelatedQueries(queryClient, authScope, residenceReviewId);
    },
  });
};
