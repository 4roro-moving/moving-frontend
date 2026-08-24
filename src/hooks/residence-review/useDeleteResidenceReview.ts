"use client";

import { useQueryClient } from "@tanstack/react-query";

import { useApiMutation } from "@/hooks/queries/useApiMutation";
import { useAuthQueryScope } from "@/hooks/useAuthQueryScope";
import { deleteResidenceReview } from "@/lib/api/residenceReviews";
import { getResidenceReviewDetailQueryKey } from "@/lib/constants/queryKeys";
import { invalidateResidenceReviewRelatedQueries } from "@/lib/queryOptions/invalidateResidenceReviewQueries";

export const useDeleteResidenceReview = () => {
  const queryClient = useQueryClient();
  const { authScope } = useAuthQueryScope();

  return useApiMutation({
    mutationFn: deleteResidenceReview,
    onSuccess: async (_data, residenceReviewId) => {
      await invalidateResidenceReviewRelatedQueries(queryClient, authScope, residenceReviewId);
      queryClient.removeQueries({
        queryKey: getResidenceReviewDetailQueryKey(authScope, residenceReviewId),
      });
    },
  });
};
