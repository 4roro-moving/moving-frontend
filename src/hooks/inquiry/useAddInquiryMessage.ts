"use client";

import { useQueryClient } from "@tanstack/react-query";

import { useApiMutation } from "@/hooks/queries/useApiMutation";
import { addInquiryMessage } from "@/lib/api/inquiries";
import { QUERY_KEYS } from "@/lib/constants/queryKeys";
import type { CreateInquiryMessageInput } from "@/types/inquiry";

export function useAddInquiryMessage(inquiryId: number) {
  const queryClient = useQueryClient();

  return useApiMutation({
    mutationFn: (input: CreateInquiryMessageInput) => addInquiryMessage(inquiryId, input),

    onSuccess: async (inquiry) => {
      queryClient.setQueryData(QUERY_KEYS.INQUIRIES.DETAIL(inquiryId), inquiry);

      await queryClient.invalidateQueries({
        queryKey: QUERY_KEYS.INQUIRIES.LIST_ROOT,
      });
    },
  });
}
