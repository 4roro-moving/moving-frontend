"use client";

import { useApiQuery } from "@/hooks/queries/useApiQuery";
import { fetchEstimateRequestDetail } from "@/lib/api/estimateRequests";
import { QUERY_KEYS } from "@/lib/constants/queryKeys";

/**
 * 보낸 견적 요청 상세 (GET /estimate-requests/:id)
 * // 2026.07.29 정슬기 - [추가]
 */
export function useEstimateRequestDetail(estimateRequestId: number) {
  return useApiQuery({
    queryKey: QUERY_KEYS.ESTIMATE_REQUESTS.DETAIL(estimateRequestId),
    queryFn: () => fetchEstimateRequestDetail(estimateRequestId),
    enabled: Number.isInteger(estimateRequestId) && estimateRequestId > 0,
  });
}
