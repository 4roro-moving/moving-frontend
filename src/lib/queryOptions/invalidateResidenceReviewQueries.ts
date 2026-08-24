import type { InvalidateQueryFilters, QueryFilters } from "@tanstack/react-query";

import {
  getResidenceReviewDetailQueryKey,
  QUERY_KEYS,
  type AuthQueryScope,
} from "@/lib/constants/queryKeys";

export const getResidenceReviewListInvalidations = (): InvalidateQueryFilters[] => [
  { queryKey: QUERY_KEYS.RESIDENCE_REVIEWS.LIST },
  { queryKey: QUERY_KEYS.RESIDENCE_REVIEWS.ME },
];

export const getResidenceReviewDetailInvalidation = (
  authScope: AuthQueryScope,
  residenceReviewId: number,
): InvalidateQueryFilters => ({
  queryKey: getResidenceReviewDetailQueryKey(authScope, residenceReviewId),
});

export const getResidenceReviewDetailRemoval = (
  authScope: AuthQueryScope,
  residenceReviewId: number,
): QueryFilters => ({
  queryKey: getResidenceReviewDetailQueryKey(authScope, residenceReviewId),
  exact: true,
});
