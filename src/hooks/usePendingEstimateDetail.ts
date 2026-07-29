"use client";

import { useApiQuery } from "@/hooks/queries/useApiQuery";
import { fetchReceivedEstimateDetail } from "@/lib/api/receivedEstimates";
import { QUERY_KEYS } from "@/lib/constants/queryKeys";

/**
 * 대기 견적 상세 — GET /estimates/:estimateId
 *
 * 받은 견적 상세와 동일 API·동일 Query Key(DETAIL)를 공유합니다. 라우트/UI만 분리됩니다.
 * // 2026.07.25 정슬기 - [추가]
 * // 2026.07.28 정슬기 - [수정] mock → 실 API
 * // 2026.07.29 정슬기 - [수정] 확정 훅 통합, PENDING_DETAIL → DETAIL 캐시 키 통합
 */
export function usePendingEstimateDetail(estimateId: number) {
  return useApiQuery({
    queryKey: QUERY_KEYS.ESTIMATES.DETAIL(estimateId),
    queryFn: () => fetchReceivedEstimateDetail(estimateId),
    enabled: Number.isInteger(estimateId) && estimateId > 0,
  });
}
