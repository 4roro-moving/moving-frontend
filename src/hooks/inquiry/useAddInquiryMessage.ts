"use client";

import { useQueryClient } from "@tanstack/react-query";

import { useApiMutation } from "@/hooks/queries/useApiMutation";
import { addInquiryMessage } from "@/lib/api/inquiries";
import { QUERY_KEYS } from "@/lib/constants/queryKeys";
import type { CreateInquiryMessageInput } from "@/types/inquiry";

interface AddInquiryMessageVariables {
  inquiryId: number;
  body: CreateInquiryMessageInput;
}

export function useAddInquiryMessage() {
  const queryClient = useQueryClient();

  return useApiMutation({
    mutationFn: ({ inquiryId, body }: AddInquiryMessageVariables) =>
      addInquiryMessage(inquiryId, body),
    onSuccess: async (inquiry, variables) => {
      queryClient.setQueryData(QUERY_KEYS.INQUIRIES.DETAIL(variables.inquiryId), inquiry);

      await queryClient.invalidateQueries({
        queryKey: QUERY_KEYS.INQUIRIES.LIST_ROOT,
      });
    },
  });
}
