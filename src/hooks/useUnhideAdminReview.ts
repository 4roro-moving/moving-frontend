"use client";

import { useQueryClient } from "@tanstack/react-query";

import { useApiMutation } from "@/hooks/queries/useApiMutation";
import { unhideAdminReview } from "@/lib/api/adminReviews";
import { QUERY_KEYS } from "@/lib/constants/queryKeys";
import type { AdminReviewActionReasonPayload } from "@/types/adminReview";

interface UnhideAdminReviewVariables {
  reviewId: number;
  reason?: string;
}

export function useUnhideAdminReview() {
  const queryClient = useQueryClient();

  return useApiMutation({
    mutationFn: ({ reviewId, reason }: UnhideAdminReviewVariables) =>
      unhideAdminReview(
        reviewId,
        reason?.trim() ? ({ reason } satisfies AdminReviewActionReasonPayload) : undefined,
      ),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: QUERY_KEYS.ADMIN.REVIEWS_ROOT });
    },
  });
}
