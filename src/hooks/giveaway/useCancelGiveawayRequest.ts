"use client";

import { useQueryClient } from "@tanstack/react-query";

import { useApiMutation } from "@/hooks/queries/useApiMutation";
import { useAuthQueryScope } from "@/hooks/useAuthQueryScope";
import { cancelGiveawayRequest } from "@/lib/api/giveawayRequests";
import {
  applyGiveawayRequestItemToCaches,
  patchGiveawayDetailQueryData,
  toGiveawayMyRequest,
} from "@/lib/queryOptions/giveawayCache";
import { invalidateGiveawayRelatedQueries } from "@/lib/queryOptions/invalidateGiveawayQueries";

export const useCancelGiveawayRequest = () => {
  const queryClient = useQueryClient();
  const { authScope } = useAuthQueryScope();

  return useApiMutation({
    mutationFn: cancelGiveawayRequest,
    onSuccess: (request) => {
      applyGiveawayRequestItemToCaches(queryClient, authScope, request);
      patchGiveawayDetailQueryData(queryClient, authScope, request.giveawayId, (current) => ({
        ...current,
        canRequest: true,
        activeRequestCount: Math.max(0, current.activeRequestCount - 1),
        myRequest: toGiveawayMyRequest(request),
      }));
      invalidateGiveawayRelatedQueries(queryClient, authScope, request.giveawayId);
    },
  });
};
