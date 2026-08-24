"use client";

import { useApiMutation } from "@/hooks/queries/useApiMutation";
import { useInvalidateResidenceReviewQueries } from "@/hooks/residence-review/useInvalidateResidenceReviewQueries";
import { createResidenceReview } from "@/lib/api/residenceReviews";
import type { CreateResidenceReviewInput } from "@/types/residenceReview";

export const useCreateResidenceReview = () => {
  const { invalidateLists } = useInvalidateResidenceReviewQueries();

  return useApiMutation({
    mutationFn: (body: CreateResidenceReviewInput) => createResidenceReview(body),
    onSuccess: () => {
      invalidateLists();
    },
  });
};
