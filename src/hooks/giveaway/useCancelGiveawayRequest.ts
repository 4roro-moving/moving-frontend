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
import { GIVEAWAY_REQUEST_STATUS, GIVEAWAY_STATUS } from "@/types/giveaway";

export const useCancelGiveawayRequest = () => {
  const queryClient = useQueryClient();
  const { authScope } = useAuthQueryScope();

  return useApiMutation({
    mutationFn: cancelGiveawayRequest,
    onSuccess: (request) => {
      applyGiveawayRequestItemToCaches(queryClient, authScope, request);
      patchGiveawayDetailQueryData(queryClient, authScope, request.giveawayId, (current) => {
        const wasSelected = current.myRequest?.status === GIVEAWAY_REQUEST_STATUS.SELECTED;

        return {
          ...current,
          status: wasSelected ? GIVEAWAY_STATUS.AVAILABLE : current.status,
          canRequest: true,
          activeRequestCount: Math.max(0, current.activeRequestCount - 1),
          myRequest: toGiveawayMyRequest(request),
          receiver: wasSelected ? null : current.receiver,
        };
      });
      invalidateGiveawayRelatedQueries(queryClient, authScope, request.giveawayId);
    },
  });
};
