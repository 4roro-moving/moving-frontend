"use client";

import { useApiQuery } from "@/hooks/queries/useApiQuery";
import { fetchFaqs } from "@/lib/api/faqs";
import { QUERY_KEYS } from "@/lib/constants/queryKeys";

export function useFaqs() {
  return useApiQuery({
    queryKey: QUERY_KEYS.FAQS.LIST,
    queryFn: fetchFaqs,
  });
}
