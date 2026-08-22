"use client";

import { useQueryClient } from "@tanstack/react-query";

import { useApiMutation } from "@/hooks/queries/useApiMutation";
import { useAuthQueryScope } from "@/hooks/useAuthQueryScope";
import { cancelGiveawayRequest } from "@/lib/api/giveawayRequests";
import { invalidateGiveawayRelatedQueries } from "@/lib/queryOptions/invalidateGiveawayQueries";

export const useCancelGiveawayRequest = () => {
  const queryClient = useQueryClient();
  const { authScope } = useAuthQueryScope();

  return useApiMutation({
    mutationFn: cancelGiveawayRequest,
    onSuccess: () => {
      invalidateGiveawayRelatedQueries(queryClient, authScope);
    },
  });
};
