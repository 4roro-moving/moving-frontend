"use client";

import { useQueryClient } from "@tanstack/react-query";
import { useEffect, useRef } from "react";

import { useApiMutation } from "@/hooks/queries/useApiMutation";
import { useApiQuery } from "@/hooks/queries/useApiQuery";
import { getApiErrorMessage } from "@/lib/api/getApiErrorMessage";
import {
  confirmPendingEstimate,
  confirmPendingEstimateDetail,
  fetchPendingEstimateDetail,
} from "@/lib/api/myEstimateRequests";
import { QUERY_KEYS } from "@/lib/constants/queryKeys";

/**
 * 대기 견적 상세 — GET /estimates/:estimateId (받은 상세와 동일)
 * // 2026.07.25 정슬기 - [추가]
 * // 2026.07.28 정슬기 - [수정] mock → 실 API
 */
export function usePendingEstimateDetail(estimateId: number) {
  return useApiQuery({
    queryKey: QUERY_KEYS.ESTIMATES.PENDING_DETAIL(estimateId),
    queryFn: () => fetchPendingEstimateDetail(estimateId),
    enabled: Number.isInteger(estimateId) && estimateId > 0,
  });
}

interface UseConfirmPendingEstimateOptions {
  onSuccess?: () => void;
  onError?: (message: string) => void;
}

/**
 * 대기 목록 카드 확정 — POST /estimates/:estimateId/confirm
 */
export function useConfirmPendingEstimate(
  estimateId: number,
  options?: UseConfirmPendingEstimateOptions,
) {
  const queryClient = useQueryClient();
  const onSuccessRef = useRef(options?.onSuccess);
  const onErrorRef = useRef(options?.onError);

  useEffect(() => {
    onSuccessRef.current = options?.onSuccess;
    onErrorRef.current = options?.onError;
  }, [options?.onSuccess, options?.onError]);

  return useApiMutation({
    mutationFn: () => confirmPendingEstimate(estimateId),
    onSuccess: async (detail) => {
      queryClient.setQueryData(QUERY_KEYS.ESTIMATES.PENDING_DETAIL(estimateId), detail);
      queryClient.setQueryData(QUERY_KEYS.ESTIMATES.DETAIL(estimateId), detail);
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: QUERY_KEYS.ESTIMATES.PENDING_LIST_ROOT }),
        queryClient.invalidateQueries({ queryKey: QUERY_KEYS.ESTIMATES.RECEIVED }),
      ]);
      onSuccessRef.current?.();
    },
    onError: (error) => {
      onErrorRef.current?.(getApiErrorMessage(error, "견적을 확정하지 못했습니다."));
    },
  });
}

interface UseConfirmPendingEstimateDetailOptions {
  onSuccess?: () => void;
  onError?: (message: string) => void;
}

/**
 * 대기 상세 확정 — POST /estimates/:estimateId/confirm
 */
export function useConfirmPendingEstimateDetail(
  estimateId: number,
  options?: UseConfirmPendingEstimateDetailOptions,
) {
  const queryClient = useQueryClient();
  const onSuccessRef = useRef(options?.onSuccess);
  const onErrorRef = useRef(options?.onError);

  useEffect(() => {
    onSuccessRef.current = options?.onSuccess;
    onErrorRef.current = options?.onError;
  }, [options?.onSuccess, options?.onError]);

  return useApiMutation({
    mutationFn: () => confirmPendingEstimateDetail(estimateId),
    onSuccess: async (detail) => {
      queryClient.setQueryData(QUERY_KEYS.ESTIMATES.PENDING_DETAIL(estimateId), detail);
      queryClient.setQueryData(QUERY_KEYS.ESTIMATES.DETAIL(estimateId), detail);
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: QUERY_KEYS.ESTIMATES.PENDING_LIST_ROOT }),
        queryClient.invalidateQueries({ queryKey: QUERY_KEYS.ESTIMATES.RECEIVED }),
      ]);
      onSuccessRef.current?.();
    },
    onError: (error) => {
      onErrorRef.current?.(getApiErrorMessage(error, "견적을 확정하지 못했습니다."));
    },
  });
}
