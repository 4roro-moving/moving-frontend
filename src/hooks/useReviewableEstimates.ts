"use client";

import { useQuery } from "@tanstack/react-query";

import { fetchReviewableEstimates } from "@/lib/api/reviews";
import { QUERY_KEYS } from "@/lib/constants/queryKeys";

// 2026.07.27 정슬기 - [추가] 작성 가능 리뷰 전체 목록 조회 (FE 페이지네이션)
export function useReviewableEstimates() {
  return useQuery({
    queryKey: QUERY_KEYS.REVIEWS.REVIEWABLE,
    queryFn: fetchReviewableEstimates,
  });
}
