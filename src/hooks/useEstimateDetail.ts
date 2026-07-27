"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import { getApiErrorMessage } from "@/lib/api/getApiErrorMessage";
import { confirmReceivedEstimate, fetchReceivedEstimateDetail } from "@/lib/api/receivedEstimates";
import { QUERY_KEYS } from "@/lib/constants/queryKeys";
import type { EstimateDetail } from "@/types/estimate";

// 2026.07.24 정슬기 - [추가] 견적 상세를 estimateId 기준으로 API 조회
export function useEstimateDetail(estimateId: number) {
  return useQuery({
    queryKey: QUERY_KEYS.ESTIMATES.DETAIL(estimateId),
    queryFn: () => fetchReceivedEstimateDetail(estimateId),
    enabled: Number.isInteger(estimateId) && estimateId > 0,
  });
}

interface UseConfirmEstimateOptions {
  onSuccess?: (detail: EstimateDetail) => void;
  onError?: (message: string) => void;
}

// 2026.07.24 정슬기 - [추가] 견적 확정 후 목록·상세 쿼리 갱신
export function useConfirmEstimate(estimateId: number, options?: UseConfirmEstimateOptions) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: () => confirmReceivedEstimate(estimateId),
    onSuccess: async (detail) => {
      // 2026.07.24 정슬기 - [수정] 상세는 setQueryData로 반영하고 목록만 invalidate
      queryClient.setQueryData(QUERY_KEYS.ESTIMATES.DETAIL(estimateId), detail);
      await queryClient.invalidateQueries({ queryKey: QUERY_KEYS.ESTIMATES.RECEIVED });
      options?.onSuccess?.(detail);
    },
    onError: (error) => {
      options?.onError?.(getApiErrorMessage(error));
    },
  });
}
