"use client";

import { useTranslations } from "next-intl";

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
 * // 2026.07.29 정슬기 - [수정] DETAIL 캐시 키 통합에 맞춰 setQueryData·invalidate 정리
 */
export function useConfirmEstimate(estimateId: number, options?: UseConfirmEstimateOptions) {
  const t = useTranslations("estimates");
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

      // BE는 확정 시 같은 요청의 다른 SENT 견적을 EXPIRED로 바꾸므로 형제 견적 상세까지 stale 처리한다.
      // 상세 prefix는 마운트된 쿼리만 재요청되고(refetchType 기본값 active) 나머지는 다음 진입 시 갱신된다.
      // 2026.07.29 정슬기 - [수정] 보낸 견적 요청 목록(MY_LIST)도 확정 후 stale 처리
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: QUERY_KEYS.ESTIMATES.RECEIVED }),
        queryClient.invalidateQueries({ queryKey: QUERY_KEYS.ESTIMATES.PENDING_LIST_ROOT }),
        queryClient.invalidateQueries({ queryKey: QUERY_KEYS.ESTIMATES.DETAIL_ROOT }),
        queryClient.invalidateQueries({ queryKey: QUERY_KEYS.ESTIMATE_REQUESTS.MY_LIST_ROOT }),
      ]);

      onSuccessRef.current?.(detail);
    },
    onError: (error) => {
      onErrorRef.current?.(getApiErrorMessage(error, t("confirmFailed")));
    },
  });
}
