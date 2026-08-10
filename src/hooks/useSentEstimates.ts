"use client";

import { useQueryClient } from "@tanstack/react-query";

import { useApiMutation } from "@/hooks/queries/useApiMutation";
import { useApiInfiniteQuery } from "@/hooks/queries/useApiInfiniteQuery";
import { useApiQuery } from "@/hooks/queries/useApiQuery";
import {
  completeSentEstimate,
  fetchSentEstimateDetail,
  fetchSentEstimates,
  type SentEstimateListQuery,
} from "@/lib/api/sentEstimates";
import { QUERY_KEYS } from "@/lib/constants/queryKeys";

const PAGE_SIZE = 6;

//보낸 견적 목록 및 무한 스크롤 처리
export function useSentEstimates(query: Omit<SentEstimateListQuery, "page" | "limit"> = {}) {
  return useApiInfiniteQuery({
    queryKey: QUERY_KEYS.ESTIMATES.SENT_LIST(query.status),
    queryFn: ({ pageParam }) => fetchSentEstimates({ ...query, page: pageParam, limit: PAGE_SIZE }),
    initialPageParam: 1,
    getNextPageParam: (lastPage) =>
      lastPage.pagination.hasNext ? lastPage.pagination.page + 1 : undefined,
  });
}

//특정 견적 상세 조회 및 캐시 관리
export function useSentEstimateDetail(estimateId: number) {
  return useApiQuery({
    queryKey: QUERY_KEYS.ESTIMATES.SENT_DETAIL(estimateId),
    queryFn: () => fetchSentEstimateDetail(estimateId),
    enabled: Number.isSafeInteger(estimateId) && estimateId > 0,
  });
}

export function useCompleteSentEstimate(estimateId: number) {
  const queryClient = useQueryClient();

  return useApiMutation({
    mutationFn: () => completeSentEstimate(estimateId),
    onSuccess: async (completedEstimate) => {
      queryClient.setQueryData(QUERY_KEYS.ESTIMATES.SENT_DETAIL(estimateId), completedEstimate);
      await queryClient.invalidateQueries({
        queryKey: QUERY_KEYS.ESTIMATES.SENT_LIST_ROOT,
      });
    },
  });
}
