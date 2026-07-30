"use client";

import { useApiQuery } from "@/hooks/queries/useApiQuery";
import { fetchReceivedEstimateDetail } from "@/lib/api/receivedEstimates";
import { QUERY_KEYS } from "@/lib/constants/queryKeys";

/**
 * 견적 상세 (GET /estimates/:estimateId) — 받았던/대기 상세 공통 DETAIL 캐시
 * // 2026.07.24 정슬기 - [추가]
 * // 2026.07.28 정슬기 - [수정] useApiQuery 적용
 * // 2026.07.29 정슬기 - [수정] 확정 훅 분리, 대기 상세와 DETAIL 키 공유
 * // 2026.07.30 정슬기 - [수정] usePendingEstimateDetail 제거 후 이 훅으로 통합
 */
export function useEstimateDetail(estimateId: number) {
  return useApiQuery({
    queryKey: QUERY_KEYS.ESTIMATES.DETAIL(estimateId),
    queryFn: () => fetchReceivedEstimateDetail(estimateId),
    enabled: Number.isInteger(estimateId) && estimateId > 0,
  });
}
