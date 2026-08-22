"use client";

import { useQueryClient } from "@tanstack/react-query";

import { useApiMutation } from "@/hooks/queries/useApiMutation";
import { useAuthQueryScope } from "@/hooks/useAuthQueryScope";
import { rejectGiveawayRequest } from "@/lib/api/giveawayRequests";
import { invalidateGiveawayRelatedQueries } from "@/lib/queryOptions/invalidateGiveawayQueries";

interface RejectGiveawayRequestVariables {
  giveawayId: number;
  requestId: number;
}

export const useRejectGiveawayRequest = () => {
  const queryClient = useQueryClient();
  const { authScope } = useAuthQueryScope();

  return useApiMutation({
    mutationFn: ({ giveawayId, requestId }: RejectGiveawayRequestVariables) =>
      rejectGiveawayRequest(giveawayId, requestId),
    onSuccess: (_data, { giveawayId }) => {
      invalidateGiveawayRelatedQueries(queryClient, authScope, giveawayId);
    },
  });
};
