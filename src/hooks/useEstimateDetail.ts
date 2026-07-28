"use client";

import { useQueryClient } from "@tanstack/react-query";
import { useEffect, useRef } from "react";

import { useApiMutation } from "@/hooks/queries/useApiMutation";
import { useApiQuery } from "@/hooks/queries/useApiQuery";
import { getApiErrorMessage } from "@/lib/api/getApiErrorMessage";
import { confirmReceivedEstimate, fetchReceivedEstimateDetail } from "@/lib/api/receivedEstimates";
import { QUERY_KEYS } from "@/lib/constants/queryKeys";
import type { EstimateDetail } from "@/types/estimate";

/**
 * 견적 상세 (GET /estimates/:estimateId) — 받았던/대기 상세 공통
 * // 2026.07.24 정슬기 - [추가]
 * // 2026.07.28 정슬기 - [수정] useApiQuery 적용
 */
export function useEstimateDetail(estimateId: number) {
  return useApiQuery({
    queryKey: QUERY_KEYS.ESTIMATES.DETAIL(estimateId),
    queryFn: () => fetchReceivedEstimateDetail(estimateId),
    enabled: Number.isInteger(estimateId) && estimateId > 0,
  });
}

interface UseConfirmEstimateOptions {
  onSuccess?: (detail: EstimateDetail) => void;
  onError?: (message: string) => void;
}

/**
 * 견적 확정 (POST /estimates/:estimateId/confirm)
 * // 2026.07.24 정슬기 - [추가]
 * // 2026.07.28 정슬기 - [수정] useApiMutation + received/pending 목록 캐시 무효화
 */
export function useConfirmEstimate(estimateId: number, options?: UseConfirmEstimateOptions) {
  const queryClient = useQueryClient();
  const onSuccessRef = useRef(options?.onSuccess);
  const onErrorRef = useRef(options?.onError);

  useEffect(() => {
    onSuccessRef.current = options?.onSuccess;
    onErrorRef.current = options?.onError;
  }, [options?.onSuccess, options?.onError]);

  return useApiMutation({
    mutationFn: () => confirmReceivedEstimate(estimateId),
    onSuccess: async (detail) => {
      queryClient.setQueryData(QUERY_KEYS.ESTIMATES.DETAIL(estimateId), detail);
      queryClient.setQueryData(QUERY_KEYS.ESTIMATES.PENDING_DETAIL(estimateId), detail);
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: QUERY_KEYS.ESTIMATES.RECEIVED }),
        // Query Key 분리 전: pending 목록은 MY_LIST 사용
        queryClient.invalidateQueries({ queryKey: QUERY_KEYS.ESTIMATE_REQUESTS.MY_LIST }),
      ]);
      onSuccessRef.current?.(detail);
    },
    onError: (error) => {
      onErrorRef.current?.(getApiErrorMessage(error));
    },
  });
}
