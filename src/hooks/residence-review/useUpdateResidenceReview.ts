"use client";

import { useQueryClient } from "@tanstack/react-query";

import { useApiMutation } from "@/hooks/queries/useApiMutation";
import { useAuthQueryScope } from "@/hooks/useAuthQueryScope";
import { updateResidenceReview } from "@/lib/api/residenceReviews";
import { getResidenceReviewDetailQueryKey } from "@/lib/constants/queryKeys";
import { invalidateResidenceReviewRelatedQueries } from "@/lib/queryOptions/invalidateResidenceReviewQueries";
import type { PublicResidenceReview, UpdateResidenceReviewInput } from "@/types/residenceReview";

interface UpdateResidenceReviewVariables {
  residenceReviewId: number;
  body: UpdateResidenceReviewInput;
}

export const useUpdateResidenceReview = () => {
  const queryClient = useQueryClient();
  const { authScope } = useAuthQueryScope();

  return useApiMutation({
    mutationFn: ({ residenceReviewId, body }: UpdateResidenceReviewVariables) =>
      updateResidenceReview(residenceReviewId, body),
    onSuccess: async (review: PublicResidenceReview) => {
      queryClient.setQueryData(getResidenceReviewDetailQueryKey(authScope, review.id), review);
      await invalidateResidenceReviewRelatedQueries(queryClient, authScope, review.id);
    },
  });
};
