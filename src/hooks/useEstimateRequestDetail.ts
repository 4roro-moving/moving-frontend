"use client";

import { useApiQuery } from "@/hooks/queries/useApiQuery";
import { useCustomerAuthReady } from "@/hooks/useCustomerAuthReady";
import { fetchEstimateRequestDetail } from "@/lib/api/estimateRequests";
import { QUERY_KEYS } from "@/lib/constants/queryKeys";

/**
 * 보낸 견적 요청 상세 (GET /estimate-requests/:id)
 * // 2026.07.29 정슬기 - [추가]
 * // 2026.07.30 정슬기 - [수정] 인증 준비 후 조회
 */
export function useEstimateRequestDetail(estimateRequestId: number) {
  const { canFetch } = useCustomerAuthReady();

  return useApiQuery({
    queryKey: QUERY_KEYS.ESTIMATE_REQUESTS.DETAIL(estimateRequestId),
    queryFn: () => fetchEstimateRequestDetail(estimateRequestId),
    enabled: canFetch && Number.isInteger(estimateRequestId) && estimateRequestId > 0,
  });
}
