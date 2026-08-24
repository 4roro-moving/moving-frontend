import type { QueryClient } from "@tanstack/react-query";

import {
  getResidenceReviewDetailQueryKey,
  QUERY_KEYS,
  type AuthQueryScope,
} from "@/lib/constants/queryKeys";

export const invalidateResidenceReviewLists = async (queryClient: QueryClient) => {
  await queryClient.invalidateQueries({
    queryKey: QUERY_KEYS.RESIDENCE_REVIEWS.ALL,
  });
};

export const invalidateResidenceReviewDetail = async (
  queryClient: QueryClient,
  authScope: AuthQueryScope,
  residenceReviewId: number,
) => {
  await queryClient.invalidateQueries({
    queryKey: getResidenceReviewDetailQueryKey(authScope, residenceReviewId),
  });
};

export const invalidateResidenceReviewRelatedQueries = async (
  queryClient: QueryClient,
  authScope: AuthQueryScope,
  residenceReviewId?: number,
) => {
  await invalidateResidenceReviewLists(queryClient);

  if (residenceReviewId !== undefined) {
    await invalidateResidenceReviewDetail(queryClient, authScope, residenceReviewId);
  }
};
