"use client";

import { useApiQuery } from "@/hooks/queries/useApiQuery";
import { fetchInquiries } from "@/lib/api/inquiries";
import { QUERY_KEYS } from "@/lib/constants/queryKeys";
import type { InquiryListQuery } from "@/types/inquiry";

export function useInquiries(query: InquiryListQuery) {
  return useApiQuery({
    queryKey: QUERY_KEYS.INQUIRIES.LIST(query),
    queryFn: () => fetchInquiries(query),
  });
}
