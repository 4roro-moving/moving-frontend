import { useQuery } from "@tanstack/react-query";

import { getMoverEstimateRequests } from "@/lib/api/moverEstimateRequests";
import { QUERY_KEYS } from "@/lib/constants/queryKeys";
import type { MoverEstimateRequestQuery } from "@/types/moverEstimateRequest";

export function useMoverEstimateRequests(query: MoverEstimateRequestQuery) {
  return useQuery({
    queryKey: [...QUERY_KEYS.ESTIMATES.ALL, query],
    queryFn: () => getMoverEstimateRequests(query),
  });
}
