"use client";

import { keepPreviousData } from "@tanstack/react-query";

import { useApiQuery } from "@/hooks/queries/useApiQuery";
import { useCustomerAuthReady } from "@/hooks/useCustomerAuthReady";
import {
  fetchPendingEstimateSections,
  PENDING_ESTIMATE_PAGE_LIMIT,
} from "@/lib/api/pendingEstimates";
import { QUERY_KEYS } from "@/lib/constants/queryKeys";
import type { MyEstimateRequestListQuery } from "@/types/estimate";

/**
 * 대기 중인 견적 목록 (GET /estimates/pending)
 * // 2026.07.25 정슬기 - [추가]
 * // 2026.07.30 정슬기 - [수정] useMyEstimateRequests → usePendingEstimateSections
 * // 2026.07.30 정슬기 - [수정] 인증 준비 후 조회
 */
export function usePendingEstimateSections(query: MyEstimateRequestListQuery = {}) {
  const page = query.page ?? 1;
  const limit = query.limit ?? PENDING_ESTIMATE_PAGE_LIMIT;
  const { canFetch } = useCustomerAuthReady();

  return useApiQuery({
    queryKey: QUERY_KEYS.ESTIMATES.PENDING_LIST(page, limit),
    queryFn: () => fetchPendingEstimateSections({ page, limit }),
    placeholderData: keepPreviousData,
    enabled: canFetch,
  });
}
