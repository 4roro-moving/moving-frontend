"use client";

import { useQueryClient } from "@tanstack/react-query";

import { useApiMutation } from "@/hooks/queries/useApiMutation";
import { useAuthQueryScope } from "@/hooks/useAuthQueryScope";
import { deleteResidenceReview } from "@/lib/api/residenceReviews";
import {
  getResidenceReviewDetailQueryKey,
  getResidenceReviewListScopeQueryKey,
} from "@/lib/constants/queryKeys";

export const useDeleteResidenceReview = () => {
  const queryClient = useQueryClient();
  const { authScope } = useAuthQueryScope();

  return useApiMutation({
    mutationFn: deleteResidenceReview,
    onSuccess: (_data, residenceReviewId) => {
      void queryClient.invalidateQueries({
        queryKey: getResidenceReviewListScopeQueryKey(authScope),
      });
      void queryClient.removeQueries({
        queryKey: getResidenceReviewDetailQueryKey(authScope, residenceReviewId),
      });
    },
  });
};
