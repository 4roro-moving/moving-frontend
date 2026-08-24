"use client";

import { useQueryClient } from "@tanstack/react-query";

import { useApiMutation } from "@/hooks/queries/useApiMutation";
import { createResidenceReview } from "@/lib/api/residenceReviews";
import { invalidateResidenceReviewLists } from "@/lib/queryOptions/invalidateResidenceReviewQueries";
import type { CreateResidenceReviewInput } from "@/types/residenceReview";

export const useCreateResidenceReview = () => {
  const queryClient = useQueryClient();

  return useApiMutation({
    mutationFn: (body: CreateResidenceReviewInput) => createResidenceReview(body),
    onSuccess: () => {
      invalidateResidenceReviewLists(queryClient);
    },
  });
};
