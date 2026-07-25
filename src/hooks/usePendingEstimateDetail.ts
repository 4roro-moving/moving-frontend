"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useEffect, useRef } from "react";

import { getApiErrorMessage } from "@/lib/api/getApiErrorMessage";
import {
  confirmPendingEstimate,
  confirmPendingEstimateDetail,
  fetchPendingEstimateDetail,
} from "@/lib/api/myEstimateRequests";
import { QUERY_KEYS } from "@/lib/constants/queryKeys";

// 2026.07.25 정슬기 - [추가] 대기 견적 상세 ViewModel 조회 (mock service)
export function usePendingEstimateDetail(estimateId: number) {
  return useQuery({
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
 * 대기 목록 카드용 mock 확정
 * 목록 캐시(MY_LIST)만 invalidate 합니다.
 * // 2026.07.26 정슬기 - [추가] PendingEstimateCard 인라인 mutation을 훅으로 분리
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

  return useMutation({
    mutationFn: () => confirmPendingEstimate(estimateId),
    onSuccess: async () => {
      // 목록 섹션의 견적 상태가 바뀌므로 MY_LIST prefix 전체 무효화
      await queryClient.invalidateQueries({ queryKey: QUERY_KEYS.ESTIMATE_REQUESTS.MY_LIST });
      // 열려 있을 수 있는 대기 상세도 함께 맞춤
      await queryClient.invalidateQueries({
        queryKey: QUERY_KEYS.ESTIMATES.PENDING_DETAIL(estimateId),
      });
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

// 2026.07.25 정슬기 - [추가] 대기 상세 mock 확정 — 실 confirm API 미호출
// 2026.07.26 정슬기 - [수정] 콜백 stale closure 방지 + getApiErrorMessage 통일
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

  return useMutation({
    mutationFn: () => confirmPendingEstimateDetail(estimateId),
    onSuccess: async (detail) => {
      // 상세는 응답 ViewModel로 즉시 반영
      queryClient.setQueryData(QUERY_KEYS.ESTIMATES.PENDING_DETAIL(estimateId), detail);
      // 목록 상태(확정/대기) 동기화
      await queryClient.invalidateQueries({ queryKey: QUERY_KEYS.ESTIMATE_REQUESTS.MY_LIST });
      onSuccessRef.current?.();
    },
    onError: (error) => {
      onErrorRef.current?.(getApiErrorMessage(error, "견적을 확정하지 못했습니다."));
    },
  });
}
