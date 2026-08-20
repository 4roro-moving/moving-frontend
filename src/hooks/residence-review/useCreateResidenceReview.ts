"use client";

import { useQueryClient } from "@tanstack/react-query";

import { useApiMutation } from "@/hooks/queries/useApiMutation";
import { useAuthQueryScope } from "@/hooks/useAuthQueryScope";
import { createResidenceReview } from "@/lib/api/residenceReviews";
import {
  getResidenceReviewListScopeQueryKey,
  getResidenceReviewMyListScopeQueryKey,
} from "@/lib/constants/queryKeys";
import type { CreateResidenceReviewInput } from "@/types/residenceReview";

export const useCreateResidenceReview = () => {
  const queryClient = useQueryClient();
  const { authScope } = useAuthQueryScope();

  return useApiMutation({
    mutationFn: (body: CreateResidenceReviewInput) => createResidenceReview(body),
    onSuccess: () => {
      void queryClient.invalidateQueries({
        queryKey: getResidenceReviewListScopeQueryKey(authScope),
      });
      void queryClient.invalidateQueries({
        queryKey: getResidenceReviewMyListScopeQueryKey(authScope),
      });
    },
  });
};
