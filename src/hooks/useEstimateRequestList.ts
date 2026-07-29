"use client";

import { keepPreviousData } from "@tanstack/react-query";

import { useApiQuery } from "@/hooks/queries/useApiQuery";
import {
  ESTIMATE_REQUEST_LIST_PAGE_LIMIT,
  fetchMyEstimateRequestList,
} from "@/lib/api/estimateRequests";
import { QUERY_KEYS } from "@/lib/constants/queryKeys";
import type { MyEstimateRequestListQuery } from "@/types/estimate";

/**
 * 보낸 견적 요청 목록 (GET /estimate-requests)
 * pending용 useMyEstimateRequests와 분리
 * // 2026.07.29 정슬기 - [추가]
 */
export function useEstimateRequestList(query: MyEstimateRequestListQuery = {}) {
  const page = query.page ?? 1;
  const limit = query.limit ?? ESTIMATE_REQUEST_LIST_PAGE_LIMIT;

  return useApiQuery({
    queryKey: QUERY_KEYS.ESTIMATE_REQUESTS.MY_LIST(page, limit),
    queryFn: () => fetchMyEstimateRequestList({ page, limit }),
    placeholderData: keepPreviousData,
  });
}
