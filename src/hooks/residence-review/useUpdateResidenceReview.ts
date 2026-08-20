"use client";

import { useQueryClient } from "@tanstack/react-query";

import { useApiMutation } from "@/hooks/queries/useApiMutation";
import { useAuthQueryScope } from "@/hooks/useAuthQueryScope";
import { updateResidenceReview } from "@/lib/api/residenceReviews";
import {
  getResidenceReviewDetailQueryKey,
  getResidenceReviewListScopeQueryKey,
  getResidenceReviewMyListScopeQueryKey,
} from "@/lib/constants/queryKeys";
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
    onSuccess: (review: PublicResidenceReview) => {
      queryClient.setQueryData(getResidenceReviewDetailQueryKey(authScope, review.id), review);
      void queryClient.invalidateQueries({
        queryKey: getResidenceReviewListScopeQueryKey(),
      });
      void queryClient.invalidateQueries({
        queryKey: getResidenceReviewMyListScopeQueryKey(authScope),
      });
    },
  });
};
