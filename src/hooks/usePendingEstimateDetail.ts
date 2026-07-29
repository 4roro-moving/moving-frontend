"use client";

import { useApiQuery } from "@/hooks/queries/useApiQuery";
import { fetchPendingEstimateDetail } from "@/lib/api/myEstimateRequests";
import { QUERY_KEYS } from "@/lib/constants/queryKeys";

/**
 * 대기 견적 상세 — GET /estimates/:estimateId (받은 상세와 동일)
 * // 2026.07.25 정슬기 - [추가]
 * // 2026.07.28 정슬기 - [수정] mock → 실 API
 * // 2026.07.29 정슬기 - [수정] 확정 훅 2개를 useConfirmEstimate로 통합해 제거
 */
export function usePendingEstimateDetail(estimateId: number) {
  return useApiQuery({
    queryKey: QUERY_KEYS.ESTIMATES.PENDING_DETAIL(estimateId),
    queryFn: () => fetchPendingEstimateDetail(estimateId),
    enabled: Number.isInteger(estimateId) && estimateId > 0,
  });
}
