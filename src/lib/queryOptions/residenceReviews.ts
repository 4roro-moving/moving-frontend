import { infiniteQueryOptions, queryOptions } from "@tanstack/react-query";

import { fetchResidenceReviewDetail, fetchResidenceReviews } from "@/lib/api/residenceReviews";
import {
  getResidenceReviewDetailQueryKey,
  getResidenceReviewListQueryKey,
  type AuthQueryScope,
} from "@/lib/constants/queryKeys";
import { RESIDENCE_REVIEW_LIST_STALE_TIME_MS } from "@/lib/constants/residenceReview";
import type { ResidenceReviewListQuery } from "@/types/residenceReview";

export const getResidenceReviewsInfiniteQueryOptions = (
  authScope: AuthQueryScope,
  listQuery: Omit<ResidenceReviewListQuery, "cursor">,
) => {
  return infiniteQueryOptions({
    queryKey: getResidenceReviewListQueryKey(authScope, listQuery),
    queryFn: ({ pageParam }) => fetchResidenceReviews({ ...listQuery, cursor: pageParam }),
    initialPageParam: undefined as string | undefined,
    getNextPageParam: (lastPage) =>
      lastPage.pagination.hasNext ? (lastPage.pagination.nextCursor ?? undefined) : undefined,
    staleTime: RESIDENCE_REVIEW_LIST_STALE_TIME_MS,
  });
};

export const getResidenceReviewDetailQueryOptions = (
  authScope: AuthQueryScope,
  residenceReviewId: number,
) => {
  return queryOptions({
    queryKey: getResidenceReviewDetailQueryKey(authScope, residenceReviewId),
    queryFn: () => fetchResidenceReviewDetail(residenceReviewId),
    staleTime: RESIDENCE_REVIEW_LIST_STALE_TIME_MS,
  });
};
