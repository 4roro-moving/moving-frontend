import { useQueryClient } from "@tanstack/react-query";

import { useApiInfiniteQuery } from "@/hooks/queries/useApiInfiniteQuery";
import { useApiMutation } from "@/hooks/queries/useApiMutation";
import {
  getMoverEstimateRequests,
  getRejectedEstimateRequests,
  rejectMoverEstimate,
  sendMoverEstimate,
} from "@/lib/api/moverEstimateRequests";
import { QUERY_KEYS } from "@/lib/constants/queryKeys";
import type {
  MoverEstimateRequestQuery,
  RejectEstimateRequest,
  SendEstimateRequest,
} from "@/types/moverEstimateRequest";

export function useMoverEstimateRequests(query: MoverEstimateRequestQuery) {
  return useApiInfiniteQuery({
    queryKey: [...QUERY_KEYS.ESTIMATES.ALL, query],
    queryFn: ({ pageParam }) => getMoverEstimateRequests({ ...query, cursor: pageParam }),
    initialPageParam: undefined as string | undefined,
    getNextPageParam: (lastPage) => lastPage.pagination.nextCursor ?? undefined,
  });
}

//견적 반려 조회
export function useRejectedEstimateRequests() {
  return useApiInfiniteQuery({
    queryKey: QUERY_KEYS.ESTIMATES.REJECTED,
    queryFn: ({ pageParam }) => getRejectedEstimateRequests(pageParam),
    initialPageParam: undefined as string | undefined,
    getNextPageParam: (lastPage) => lastPage.pagination.nextCursor ?? undefined,
  });
}

type SendMoverEstimateVariables = {
  estimateRequestId: number;
  input: SendEstimateRequest;
};

// 견적 전송 및 받은 요청 목록 갱신
export function useSendMoverEstimate() {
  const queryClient = useQueryClient();

  return useApiMutation({
    mutationFn: ({ estimateRequestId, input }: SendMoverEstimateVariables) =>
      sendMoverEstimate(estimateRequestId, input),

    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: QUERY_KEYS.ESTIMATES.ALL,
      });
    },
  });
}

type RejectMoverEstimateVariables = {
  estimateRequestId: number;
  input: RejectEstimateRequest;
};

export function useRejectMoverEstimate() {
  const queryClient = useQueryClient();

  return useApiMutation({
    mutationFn: ({ estimateRequestId, input }: RejectMoverEstimateVariables) =>
      rejectMoverEstimate(estimateRequestId, input),
    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: QUERY_KEYS.ESTIMATES.ALL,
      });
    },
  });
}
