"use client";

import { useQueryClient } from "@tanstack/react-query";
import { useEffect, useRef } from "react";

import { useApiMutation } from "@/hooks/queries/useApiMutation";
import { getApiErrorMessage } from "@/lib/api/getApiErrorMessage";
import { confirmReceivedEstimate } from "@/lib/api/receivedEstimates";
import { QUERY_KEYS } from "@/lib/constants/queryKeys";
import type { EstimateDetail } from "@/types/estimate";

interface UseConfirmEstimateOptions {
  onSuccess?: (detail: EstimateDetail) => void;
  onError?: (message: string) => void;
}

/**
 * 견적 확정 — POST /estimates/:estimateId/confirm
 *
 * 받았던 견적 상세 / 대기 목록 카드 / 대기 상세가 모두 같은 API를 호출하므로 확정 훅을 하나로 둡니다.
 * // 2026.07.29 정슬기 - [추가] useConfirmEstimate·useConfirmPendingEstimate·useConfirmPendingEstimateDetail 통합
 *
 * TODO: ESTIMATES.DETAIL과 ESTIMATES.PENDING_DETAIL은 같은 리소스(GET /estimates/:estimateId)를
 * 두 번 캐시하고 있습니다. 후속 작업에서 Query Key를 하나로 합치고 받은 견적/대기 구분은 UI에서만 둡니다.
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

      // BE는 확정 시 같은 요청의 다른 SENT 견적을 EXPIRED로 바꾸므로 형제 견적 상세까지 stale 처리한다.
      // 상세 prefix는 마운트된 쿼리만 재요청되고(refetchType 기본값 active) 나머지는 다음 진입 시 갱신된다.
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: QUERY_KEYS.ESTIMATES.RECEIVED }),
        queryClient.invalidateQueries({ queryKey: QUERY_KEYS.ESTIMATES.PENDING_LIST_ROOT }),
        queryClient.invalidateQueries({ queryKey: QUERY_KEYS.ESTIMATES.DETAIL_ROOT }),
        queryClient.invalidateQueries({ queryKey: QUERY_KEYS.ESTIMATES.PENDING_DETAIL_ROOT }),
      ]);

      onSuccessRef.current?.(detail);
    },
    onError: (error) => {
      onErrorRef.current?.(getApiErrorMessage(error, "견적을 확정하지 못했습니다."));
    },
  });
}
