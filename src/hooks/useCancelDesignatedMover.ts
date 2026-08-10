"use client";

import { useEffect, useRef } from "react";
import { useQueryClient } from "@tanstack/react-query";

import { useApiMutation } from "@/hooks/queries/useApiMutation";
import { cancelDesignatedMover } from "@/lib/api/estimateRequest";
import { getApiErrorMessage } from "@/lib/api/getApiErrorMessage";
import { QUERY_KEYS } from "@/lib/constants/queryKeys";
import type { MyEstimateRequestItem } from "@/types/estimate";

interface UseCancelDesignatedMoverOptions {
  onSuccess?: (data: MyEstimateRequestItem) => void;
  onError?: (message: string) => void;
}

interface CancelDesignatedMoverVariables {
  estimateRequestId: number;
  moverId: string;
}

/**
 * DELETE /estimate-requests/:id/designate/:moverId
 * 성공 시 갱신된 EstimateRequest 상세로 DETAIL·ACTIVE 캐시를 맞춘다.
 * // 2026.08.07 정슬기 - [추가]
 */
export function useCancelDesignatedMover(options?: UseCancelDesignatedMoverOptions) {
  const queryClient = useQueryClient();
  const onSuccessRef = useRef(options?.onSuccess);
  const onErrorRef = useRef(options?.onError);

  useEffect(() => {
    onSuccessRef.current = options?.onSuccess;
    onErrorRef.current = options?.onError;
  }, [options?.onSuccess, options?.onError]);

  return useApiMutation({
    mutationFn: ({ estimateRequestId, moverId }: CancelDesignatedMoverVariables) =>
      cancelDesignatedMover(estimateRequestId, moverId),
    onSuccess: async (data, variables) => {
      queryClient.setQueryData(
        QUERY_KEYS.ESTIMATE_REQUESTS.DETAIL(variables.estimateRequestId),
        data,
      );

      queryClient.setQueryData<MyEstimateRequestItem | null>(
        QUERY_KEYS.ESTIMATE_REQUESTS.ACTIVE,
        (current) => (current?.id === variables.estimateRequestId ? data : current),
      );

      await Promise.all([
        queryClient.invalidateQueries({
          queryKey: QUERY_KEYS.ESTIMATE_REQUESTS.MY_LIST_ROOT,
        }),
        queryClient.invalidateQueries({
          queryKey: QUERY_KEYS.ESTIMATES.PENDING_LIST_ROOT,
        }),
      ]);

      onSuccessRef.current?.(data);
    },
    onError: (error) => {
      onErrorRef.current?.(getApiErrorMessage(error, "지정 견적 요청을 취소하지 못했습니다."));
    },
  });
}
