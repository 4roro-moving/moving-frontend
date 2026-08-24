import type { QueryClient } from "@tanstack/react-query";

import {
  getResidenceReviewDetailQueryKey,
  QUERY_KEYS,
  type AuthQueryScope,
} from "@/lib/constants/queryKeys";

export const invalidateResidenceReviewLists = (queryClient: QueryClient) => {
  void queryClient.invalidateQueries({
    queryKey: QUERY_KEYS.RESIDENCE_REVIEWS.ALL,
  });
};

export const invalidateResidenceReviewDetail = (
  queryClient: QueryClient,
  authScope: AuthQueryScope,
  residenceReviewId: number,
) => {
  void queryClient.invalidateQueries({
    queryKey: getResidenceReviewDetailQueryKey(authScope, residenceReviewId),
  });
};

export const invalidateResidenceReviewRelatedQueries = (
  queryClient: QueryClient,
  authScope: AuthQueryScope,
  residenceReviewId?: number,
) => {
  invalidateResidenceReviewLists(queryClient);

  if (residenceReviewId !== undefined) {
    invalidateResidenceReviewDetail(queryClient, authScope, residenceReviewId);
  }
};
