"use client";

import { useApiQuery } from "@/hooks/queries/useApiQuery";
import { fetchNotices } from "@/lib/api/notices";
import { QUERY_KEYS } from "@/lib/constants/queryKeys";
import type { NoticeListQuery } from "@/types/notice";

export function useNotices(query: NoticeListQuery) {
  return useApiQuery({
    queryKey: QUERY_KEYS.NOTICES.LIST(query),
    queryFn: () => fetchNotices(query),
  });
}
