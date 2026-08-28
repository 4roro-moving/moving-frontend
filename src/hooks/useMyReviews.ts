"use client";

import { keepPreviousData } from "@tanstack/react-query";

import { useApiQuery } from "@/hooks/queries/useApiQuery";
import { useCustomerAuthReady } from "@/hooks/useCustomerAuthReady";
import { fetchMyReviews } from "@/lib/api/reviews";
import { QUERY_KEYS } from "@/lib/constants/queryKeys";
import { REVIEW_PAGE_LIMIT } from "@/lib/constants/reviewConstants";
import type { MyReviewListQuery } from "@/types/review";

/**
 * 내가 작성한 리뷰 목록
 * // 2026.07.27 정슬기 - [추가]
 * // 2026.07.30 정슬기 - [수정] useApiQuery + ME(page,limit) 키 + 인증 준비 후 조회
 */
export function useMyReviews(query: MyReviewListQuery = {}) {
  const page = query.page ?? 1;
  const limit = query.limit ?? REVIEW_PAGE_LIMIT;
  const { canFetch } = useCustomerAuthReady();

  return useApiQuery({
    queryKey: QUERY_KEYS.REVIEWS.ME(page, limit),
    queryFn: () => fetchMyReviews({ page, limit }),
    placeholderData: keepPreviousData,
    enabled: canFetch,
  });
}
