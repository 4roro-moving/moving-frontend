"use client";

import { useApiQuery } from "@/hooks/queries/useApiQuery";
import { fetchInquiryDetail } from "@/lib/api/inquiries";
import { QUERY_KEYS } from "@/lib/constants/queryKeys";

export function useInquiryDetail(inquiryId: number) {
  return useApiQuery({
    queryKey: QUERY_KEYS.INQUIRIES.DETAIL(inquiryId),
    queryFn: () => fetchInquiryDetail(inquiryId),
    enabled: Number.isInteger(inquiryId) && inquiryId > 0,
  });
}
