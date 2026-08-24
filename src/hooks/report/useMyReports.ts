"use client";

import { useApiQuery } from "@/hooks/queries/useApiQuery";
import { useAuthQueryScope } from "@/hooks/useAuthQueryScope";
import { fetchMyReports } from "@/lib/api/reports";
import { QUERY_KEYS } from "@/lib/constants/queryKeys";
import type { MyReportsQuery } from "@/types/report";

export function useMyReports(query: MyReportsQuery) {
  const { authScope, isAuthQueryReady } = useAuthQueryScope();

  return useApiQuery({
    queryKey: QUERY_KEYS.REPORTS.ME(authScope, query),
    queryFn: () => fetchMyReports(query),
    enabled: isAuthQueryReady,
  });
}
