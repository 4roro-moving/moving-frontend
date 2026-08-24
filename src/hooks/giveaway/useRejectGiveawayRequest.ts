"use client";

import { useQueryClient } from "@tanstack/react-query";

import { useApiMutation } from "@/hooks/queries/useApiMutation";
import { useAuthQueryScope } from "@/hooks/useAuthQueryScope";
import { rejectGiveawayRequest } from "@/lib/api/giveawayRequests";
import {
  applyGiveawayRequestItemToCaches,
  patchGiveawayDetailQueryData,
} from "@/lib/queryOptions/giveawayCache";
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
    onSuccess: (request, { giveawayId }) => {
      applyGiveawayRequestItemToCaches(queryClient, authScope, request);
      patchGiveawayDetailQueryData(queryClient, authScope, giveawayId, (current) => ({
        ...current,
        activeRequestCount: Math.max(0, current.activeRequestCount - 1),
      }));
      invalidateGiveawayRelatedQueries(queryClient, authScope, giveawayId);
    },
  });
};
