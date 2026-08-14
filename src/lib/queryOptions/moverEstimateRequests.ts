import { infiniteQueryOptions } from "@tanstack/react-query";

import { getMoverEstimateRequests } from "@/lib/api/moverEstimateRequests";
import { QUERY_KEYS } from "@/lib/constants/queryKeys";
import type { MoverEstimateRequestQuery } from "@/types/moverEstimateRequest";

export function getMoverEstimateRequestsInfiniteQueryOptions(query: MoverEstimateRequestQuery) {
  return infiniteQueryOptions({
    queryKey: [...QUERY_KEYS.ESTIMATES.ALL, query],
    queryFn: ({ pageParam }) =>
      getMoverEstimateRequests({
        ...query,
        cursor: pageParam,
      }),
    initialPageParam: undefined as string | undefined,
    getNextPageParam: (lastPage) => lastPage.pagination.nextCursor ?? undefined,
  });
}
