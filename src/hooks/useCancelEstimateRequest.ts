"use client";

import { useTranslations } from "next-intl";

import { useQueryClient } from "@tanstack/react-query";
import { useEffect, useRef } from "react";

import { useApiMutation } from "@/hooks/queries/useApiMutation";
import { getApiErrorMessage } from "@/lib/api/getApiErrorMessage";
import { cancelEstimateRequest } from "@/lib/api/estimateRequests";
import { QUERY_KEYS } from "@/lib/constants/queryKeys";
import type { MyEstimateRequestItem } from "@/types/estimate";

interface UseCancelEstimateRequestOptions {
  onSuccess?: (request: MyEstimateRequestItem) => void;
  onError?: (message: string) => void;
}

/**
 * 보낸 견적 요청 취소 — DELETE /estimate-requests/:id
 * // 2026.08.03 정슬기 - [추가]
 */
export function useCancelEstimateRequest(
  estimateRequestId: number,
  options?: UseCancelEstimateRequestOptions,
) {
  const t = useTranslations("estimates");
  const queryClient = useQueryClient();
  const onSuccessRef = useRef(options?.onSuccess);
  const onErrorRef = useRef(options?.onError);

  useEffect(() => {
    onSuccessRef.current = options?.onSuccess;
    onErrorRef.current = options?.onError;
  }, [options?.onSuccess, options?.onError]);

  return useApiMutation({
    mutationFn: () => cancelEstimateRequest(estimateRequestId),
    onSuccess: async (request) => {
      // 상세는 목록으로 떠나므로 remove. 목록·활성·대기 견적은 취소로 바뀌므로 invalidate.
      queryClient.removeQueries({
        queryKey: QUERY_KEYS.ESTIMATE_REQUESTS.DETAIL(estimateRequestId),
      });

      await Promise.all([
        queryClient.invalidateQueries({ queryKey: QUERY_KEYS.ESTIMATE_REQUESTS.MY_LIST_ROOT }),
        queryClient.invalidateQueries({ queryKey: QUERY_KEYS.ESTIMATE_REQUESTS.ACTIVE }),
        // SENT 견적이 CANCELED 되므로 대기·받았던·보낸 견적·상세 캐시도 갱신
        // 2026.08.04 정슬기 - [수정] DETAIL_ROOT·SENT_LIST_ROOT·SENT_DETAIL_ROOT invalidate
        queryClient.invalidateQueries({ queryKey: QUERY_KEYS.ESTIMATES.PENDING_LIST_ROOT }),
        queryClient.invalidateQueries({ queryKey: QUERY_KEYS.ESTIMATES.RECEIVED }),
        queryClient.invalidateQueries({ queryKey: QUERY_KEYS.ESTIMATES.DETAIL_ROOT }),
        queryClient.invalidateQueries({ queryKey: QUERY_KEYS.ESTIMATES.SENT_LIST_ROOT }),
        queryClient.invalidateQueries({ queryKey: QUERY_KEYS.ESTIMATES.SENT_DETAIL_ROOT }),
      ]);

      onSuccessRef.current?.(request);
    },
    onError: (error) => {
      onErrorRef.current?.(getApiErrorMessage(error, t("cancelRequestFailed")));
    },
  });
}
