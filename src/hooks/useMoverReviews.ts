"use client";

import { keepPreviousData, useQuery } from "@tanstack/react-query";

import { isMoverDetailId } from "@/hooks/useMoverDetail";
import { getMoverReviews, MOVER_REVIEW_PAGE_LIMIT } from "@/lib/api/movers";
import { QUERY_KEYS } from "@/lib/constants/queryKeys";
import type { MoverReviewListQuery } from "@/types/review";

export function useMoverReviews(moverId: string, query: MoverReviewListQuery = {}) {
  const page = query.page ?? 1;
  const limit = query.limit ?? MOVER_REVIEW_PAGE_LIMIT;

  return useQuery({
    queryKey: [...QUERY_KEYS.REVIEWS.BY_MOVER(moverId), { page, limit }] as const,
    queryFn: () => getMoverReviews(moverId, { page, limit }),
    enabled: isMoverDetailId(moverId),
    placeholderData: keepPreviousData,
  });
}
