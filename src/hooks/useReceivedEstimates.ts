"use client";

import { useQuery } from "@tanstack/react-query";

import { fetchReceivedEstimatePanels } from "@/lib/api/receivedEstimates";
import { QUERY_KEYS } from "@/lib/constants/queryKeys";

// 2026.07.24 정슬기 - [추가] 받은 견적 목록을 실제 API 응답으로 조회
export function useReceivedEstimates() {
  return useQuery({
    queryKey: QUERY_KEYS.ESTIMATES.RECEIVED,
    queryFn: fetchReceivedEstimatePanels,
  });
}
