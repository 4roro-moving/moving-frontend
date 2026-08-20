import { infiniteQueryOptions, queryOptions } from "@tanstack/react-query";

import {
  fetchMyResidenceReviews,
  fetchResidenceReviewDetail,
  fetchResidenceReviews,
} from "@/lib/api/residenceReviews";
import {
  getResidenceReviewDetailQueryKey,
  getResidenceReviewListQueryKey,
  getResidenceReviewMyListQueryKey,
  type AuthQueryScope,
} from "@/lib/constants/queryKeys";
import { RESIDENCE_REVIEW_LIST_STALE_TIME_MS } from "@/lib/constants/residenceReview";
import type { ResidenceReviewListQuery } from "@/types/residenceReview";

export const getResidenceReviewsInfiniteQueryOptions = (
  listQuery: Omit<ResidenceReviewListQuery, "cursor">,
) => {
  return infiniteQueryOptions({
    queryKey: getResidenceReviewListQueryKey(listQuery),
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

export const getMyResidenceReviewsQueryOptions = (
  authScope: AuthQueryScope,
  page: number,
  limit: number,
) => {
  return queryOptions({
    queryKey: getResidenceReviewMyListQueryKey(authScope, page, limit),
    queryFn: () => fetchMyResidenceReviews({ page, limit }),
    staleTime: RESIDENCE_REVIEW_LIST_STALE_TIME_MS,
  });
};
