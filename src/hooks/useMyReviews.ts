"use client";

import { keepPreviousData, useQuery } from "@tanstack/react-query";

import { useCustomerAuthReady } from "@/hooks/useCustomerAuthReady";
import { fetchMyReviews, MY_REVIEW_PAGE_LIMIT } from "@/lib/api/reviews";
import { QUERY_KEYS } from "@/lib/constants/queryKeys";
import type { MyReviewListQuery } from "@/types/review";

// 2026.07.27 정슬기 - [추가] 내가 작성한 리뷰 목록 조회
// 2026.07.30 정슬기 - [수정] 인증 준비 후 조회
export function useMyReviews(query: MyReviewListQuery = {}) {
  const page = query.page ?? 1;
  const limit = query.limit ?? MY_REVIEW_PAGE_LIMIT;
  const { canFetch } = useCustomerAuthReady();

  return useQuery({
    queryKey: [...QUERY_KEYS.REVIEWS.ME, { page, limit }] as const,
    queryFn: () => fetchMyReviews({ page, limit }),
    placeholderData: keepPreviousData,
    enabled: canFetch,
  });
}
