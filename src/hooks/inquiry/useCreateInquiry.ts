"use client";

import { useQueryClient } from "@tanstack/react-query";

import { useApiMutation } from "@/hooks/queries/useApiMutation";
import { createInquiry } from "@/lib/api/inquiries";
import { QUERY_KEYS } from "@/lib/constants/queryKeys";
import type { CreateInquiryInput } from "@/types/inquiry";

export function useCreateInquiry() {
  const queryClient = useQueryClient();

  return useApiMutation({
    mutationFn: (input: CreateInquiryInput) => createInquiry(input),

    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: QUERY_KEYS.INQUIRIES.LIST_ROOT,
      });
    },
  });
}
