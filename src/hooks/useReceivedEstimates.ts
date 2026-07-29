"use client";

import { useApiQuery } from "@/hooks/queries/useApiQuery";
import { fetchReceivedEstimatePanels } from "@/lib/api/receivedEstimates";
import { QUERY_KEYS } from "@/lib/constants/queryKeys";

/**
 * 받았던 견적 패널 목록
 * // 2026.07.24 정슬기 - [추가]
 * // 2026.07.28 정슬기 - [수정] useApiQuery 적용
 */
export function useReceivedEstimates() {
  return useApiQuery({
    queryKey: QUERY_KEYS.ESTIMATES.RECEIVED,
    queryFn: fetchReceivedEstimatePanels,
  });
}
