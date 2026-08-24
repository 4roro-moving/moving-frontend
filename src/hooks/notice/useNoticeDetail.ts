"use client";

import { useApiQuery } from "@/hooks/queries/useApiQuery";
import { fetchNoticeDetail } from "@/lib/api/notices";
import { QUERY_KEYS } from "@/lib/constants/queryKeys";

export function useNoticeDetail(noticeId: number) {
  return useApiQuery({
    queryKey: QUERY_KEYS.NOTICES.DETAIL(noticeId),
    queryFn: () => fetchNoticeDetail(noticeId),
    enabled: Number.isInteger(noticeId) && noticeId > 0,
  });
}
