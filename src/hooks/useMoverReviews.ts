"use client";

import { keepPreviousData } from "@tanstack/react-query";

import { useApiQuery } from "@/hooks/queries/useApiQuery";
import { isMoverDetailId } from "@/lib/utils/isMoverDetailId";
import { getMoverReviews, MOVER_REVIEW_PAGE_LIMIT } from "@/lib/api/movers";
import { QUERY_KEYS } from "@/lib/constants/queryKeys";
import type { MoverReviewListQuery } from "@/types/review";

/**
 * 기사님 상세 리뷰 목록 (공개)
 * // 2026.07.30 정슬기 - [수정] useApiQuery + BY_MOVER(page,limit) 키
 */
export function useMoverReviews(moverId: string, query: MoverReviewListQuery = {}) {
  const page = query.page ?? 1;
  const limit = query.limit ?? MOVER_REVIEW_PAGE_LIMIT;

  return useApiQuery({
    queryKey: QUERY_KEYS.REVIEWS.BY_MOVER(moverId, page, limit),
    queryFn: () => getMoverReviews(moverId, { page, limit }),
    enabled: isMoverDetailId(moverId),
    placeholderData: keepPreviousData,
  });
}
