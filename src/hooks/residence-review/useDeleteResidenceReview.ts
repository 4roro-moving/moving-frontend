"use client";

import { useApiMutation } from "@/hooks/queries/useApiMutation";
import { useInvalidateResidenceReviewQueries } from "@/hooks/residence-review/useInvalidateResidenceReviewQueries";
import { deleteResidenceReview } from "@/lib/api/residenceReviews";

export const useDeleteResidenceReview = () => {
  const { invalidateLists, removeDetail } = useInvalidateResidenceReviewQueries();

  return useApiMutation({
    mutationFn: deleteResidenceReview,
    onSuccess: (_data, residenceReviewId) => {
      removeDetail(residenceReviewId);
      invalidateLists();
    },
  });
};
