"use client";

import { useQueryClient } from "@tanstack/react-query";

import { useApiMutation } from "@/hooks/queries/useApiMutation";
import { useInvalidateResidenceReviewQueries } from "@/hooks/residence-review/useInvalidateResidenceReviewQueries";
import { useAuthQueryScope } from "@/hooks/useAuthQueryScope";
import { updateResidenceReview } from "@/lib/api/residenceReviews";
import { getResidenceReviewDetailQueryKey } from "@/lib/constants/queryKeys";
import type { PublicResidenceReview, UpdateResidenceReviewInput } from "@/types/residenceReview";

interface UpdateResidenceReviewVariables {
  residenceReviewId: number;
  body: UpdateResidenceReviewInput;
}

export const useUpdateResidenceReview = () => {
  const queryClient = useQueryClient();
  const { authScope } = useAuthQueryScope();
  const { invalidateRelated } = useInvalidateResidenceReviewQueries();

  return useApiMutation({
    mutationFn: ({ residenceReviewId, body }: UpdateResidenceReviewVariables) =>
      updateResidenceReview(residenceReviewId, body),
    onSuccess: (review: PublicResidenceReview) => {
      queryClient.setQueryData(getResidenceReviewDetailQueryKey(authScope, review.id), review);
      invalidateRelated(review.id);
    },
  });
};
