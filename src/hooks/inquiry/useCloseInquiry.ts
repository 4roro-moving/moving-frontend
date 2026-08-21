"use client";

import { useQueryClient } from "@tanstack/react-query";

import { useApiMutation } from "@/hooks/queries/useApiMutation";
import { closeInquiry } from "@/lib/api/inquiries";
import { QUERY_KEYS } from "@/lib/constants/queryKeys";

export function useCloseInquiry() {
  const queryClient = useQueryClient();

  return useApiMutation({
    mutationFn: closeInquiry,
    onSuccess: async (inquiry) => {
      queryClient.setQueryData(QUERY_KEYS.INQUIRIES.DETAIL(inquiry.id), inquiry);

      await queryClient.invalidateQueries({
        queryKey: QUERY_KEYS.INQUIRIES.LIST_ROOT,
      });
    },
  });
}
