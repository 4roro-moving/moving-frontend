"use client";

import { useQuery } from "@tanstack/react-query";

import { fetchPendingEstimateSections } from "@/lib/api/myEstimateRequests";
import { QUERY_KEYS } from "@/lib/constants/queryKeys";
import type { MyEstimateRequestListQuery } from "@/types/estimate";

// 2026.07.25 정슬기 - [추가] 대기 중 견적 목록 ViewModel 조회
// 2026.07.25 정슬기 - [수정] API 계약 대신 PendingEstimateSection 조립 service 사용
export function useMyEstimateRequests(query: MyEstimateRequestListQuery = {}) {
  return useQuery({
    queryKey: [...QUERY_KEYS.ESTIMATE_REQUESTS.MY_LIST, query] as const,
    queryFn: () => fetchPendingEstimateSections(query),
  });
}
