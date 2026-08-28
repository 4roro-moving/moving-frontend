"use client";

import { useQueryClient } from "@tanstack/react-query";

import { useAuthQueryScope } from "@/hooks/useAuthQueryScope";
import {
  getResidenceReviewDetailInvalidation,
  getResidenceReviewDetailRemoval,
  getResidenceReviewListInvalidations,
} from "@/lib/queryOptions/invalidateResidenceReviewQueries";

export const useInvalidateResidenceReviewQueries = () => {
  const queryClient = useQueryClient();
  const { authScope } = useAuthQueryScope();

  const invalidateLists = () => {
    getResidenceReviewListInvalidations().forEach((filters) => {
      void queryClient.invalidateQueries(filters);
    });
  };

  const invalidateDetail = (residenceReviewId: number) => {
    void queryClient.invalidateQueries(
      getResidenceReviewDetailInvalidation(authScope, residenceReviewId),
    );
  };

  const invalidateRelated = (residenceReviewId?: number) => {
    invalidateLists();

    if (residenceReviewId !== undefined) {
      invalidateDetail(residenceReviewId);
    }
  };

  const removeDetail = (residenceReviewId: number) => {
    queryClient.removeQueries(getResidenceReviewDetailRemoval(authScope, residenceReviewId));
  };

  return {
    invalidateLists,
    invalidateRelated,
    removeDetail,
  };
};
