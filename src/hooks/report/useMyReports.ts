"use client";

import { useApiQuery } from "@/hooks/queries/useApiQuery";
import { fetchMyReports } from "@/lib/api/reports";
import { QUERY_KEYS } from "@/lib/constants/queryKeys";
import type { MyReportsQuery } from "@/types/report";

export function useMyReports(query: MyReportsQuery) {
  return useApiQuery({
    queryKey: QUERY_KEYS.REPORTS.ME(query),
    queryFn: () => fetchMyReports(query),
  });
}
