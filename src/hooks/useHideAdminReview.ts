"use client";

import { useQueryClient } from "@tanstack/react-query";

import { useApiMutation } from "@/hooks/queries/useApiMutation";
import { hideAdminReview } from "@/lib/api/adminReviews";
import { QUERY_KEYS } from "@/lib/constants/queryKeys";
import type { AdminReviewActionReasonPayload } from "@/types/adminReview";

interface HideAdminReviewVariables {
  reviewId: number;
  reason: string;
}

export function useHideAdminReview() {
  const queryClient = useQueryClient();

  return useApiMutation({
    mutationFn: ({ reviewId, reason }: HideAdminReviewVariables) =>
      hideAdminReview(reviewId, { reason } satisfies AdminReviewActionReasonPayload),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: QUERY_KEYS.ADMIN.REVIEWS_ROOT });
    },
  });
}
