import { useInfiniteQuery, useMutation, useQueryClient } from "@tanstack/react-query";

import { getMoverEstimateRequests, sendMoverEstimate } from "@/lib/api/moverEstimateRequests";
import { QUERY_KEYS } from "@/lib/constants/queryKeys";
import type { MoverEstimateRequestQuery, SendEstimateRequest } from "@/types/moverEstimateRequest";

export function useMoverEstimateRequests(query: MoverEstimateRequestQuery) {
  return useInfiniteQuery({
    queryKey: [...QUERY_KEYS.ESTIMATES.ALL, query],
    queryFn: ({ pageParam }) => getMoverEstimateRequests({ ...query, cursor: pageParam }),
    initialPageParam: undefined as string | undefined,
    getNextPageParam: (lastPage) => lastPage.pagination.nextCursor ?? undefined,
  });
}

type SendMoverEstimateVariables = {
  estimateRequestId: number;
  input: SendEstimateRequest;
};

// 견적 전송 및 받은 요청 목록 갱신
/*{
  estimateRequestId: 4,
  input: {
    price: 180000,
    comment: "~ 진행하겠습니다.",
  },
} */
export function useSendMoverEstimate() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ estimateRequestId, input }: SendMoverEstimateVariables) =>
      sendMoverEstimate(estimateRequestId, input),
    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: QUERY_KEYS.ESTIMATES.ALL,
      });
    },
  });
}
