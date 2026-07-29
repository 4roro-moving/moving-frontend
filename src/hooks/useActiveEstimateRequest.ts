"use client";

import { getActiveEstimateRequest } from "@/lib/api/estimateRequest";
import { QUERY_KEYS } from "@/lib/constants/queryKeys";
import { useApiQuery } from "@/hooks/queries/useApiQuery";

interface UseActiveEstimateRequestOptions {
  /** 비로그인이면 false. SSR에서 hasAuthSession()은 false라 호출부에서 명시하는 것을 권장 */
  enabled?: boolean;
}

/** GET /estimate-requests/active */
export function useActiveEstimateRequest(options?: UseActiveEstimateRequestOptions) {
  // hasAuthSession()은 SSR에서 false라 기본값으로 쓰지 않음. 호출부에서 명시.
  const enabled = options?.enabled ?? false;

  return useApiQuery({
    queryKey: QUERY_KEYS.ESTIMATE_REQUESTS.ACTIVE,
    queryFn: getActiveEstimateRequest,
    enabled,
  });
}
