"use client";

import { useEffect, useRef } from "react";
import { useQueryClient } from "@tanstack/react-query";

import { designateMover } from "@/lib/api/estimateRequest";
import { getApiErrorMessage } from "@/lib/api/getApiErrorMessage";
import { QUERY_KEYS } from "@/lib/constants/queryKeys";
import { useApiMutation } from "@/hooks/queries/useApiMutation";
import type { MyEstimateRequestItem } from "@/types/estimate";

interface UseDesignateMoverOptions {
  onSuccess?: (data: MyEstimateRequestItem) => void;
  onError?: (message: string) => void;
}

interface DesignateMoverVariables {
  estimateRequestId: number;
  moverId: string;
}

/** POST /estimate-requests/:id/designate */
export function useDesignateMover(options?: UseDesignateMoverOptions) {
  const queryClient = useQueryClient();
  const onSuccessRef = useRef(options?.onSuccess);
  const onErrorRef = useRef(options?.onError);

  useEffect(() => {
    onSuccessRef.current = options?.onSuccess;
    onErrorRef.current = options?.onError;
  }, [options?.onSuccess, options?.onError]);

  return useApiMutation({
    mutationFn: ({ estimateRequestId, moverId }: DesignateMoverVariables) =>
      designateMover(estimateRequestId, moverId),
    onSuccess: async (data, variables) => {
      queryClient.setQueryData(
        QUERY_KEYS.ESTIMATE_REQUESTS.DETAIL(variables.estimateRequestId),
        data,
      );
      queryClient.setQueryData(QUERY_KEYS.ESTIMATE_REQUESTS.ACTIVE, data);
      await queryClient.invalidateQueries({
        queryKey: QUERY_KEYS.ESTIMATES.PENDING_LIST_ROOT,
      });
      onSuccessRef.current?.(data);
    },
    onError: (error) => {
      onErrorRef.current?.(getApiErrorMessage(error, "지정 견적 요청에 실패했습니다."));
    },
  });
}
