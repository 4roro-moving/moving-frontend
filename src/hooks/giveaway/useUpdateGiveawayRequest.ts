"use client";

import { useQueryClient } from "@tanstack/react-query";

import { useApiMutation } from "@/hooks/queries/useApiMutation";
import { useAuthQueryScope } from "@/hooks/useAuthQueryScope";
import { updateGiveawayRequest } from "@/lib/api/giveawayRequests";
import {
  applyGiveawayRequestItemToCaches,
  patchGiveawayDetailQueryData,
  toGiveawayMyRequest,
} from "@/lib/queryOptions/giveawayCache";
import { invalidateGiveawayRelatedQueries } from "@/lib/queryOptions/invalidateGiveawayQueries";
import type { UpdateGiveawayRequestInput } from "@/types/giveaway";

interface UpdateGiveawayRequestVariables {
  requestId: number;
  giveawayId?: number;
  body: UpdateGiveawayRequestInput;
}

export const useUpdateGiveawayRequest = () => {
  const queryClient = useQueryClient();
  const { authScope } = useAuthQueryScope();

  return useApiMutation({
    mutationFn: ({ requestId, body }: UpdateGiveawayRequestVariables) =>
      updateGiveawayRequest(requestId, body),
    onSuccess: (request, { giveawayId }) => {
      applyGiveawayRequestItemToCaches(queryClient, authScope, request);

      if (giveawayId !== undefined) {
        patchGiveawayDetailQueryData(queryClient, authScope, giveawayId, (current) => {
          if (current.myRequest?.id !== request.id) {
            return current;
          }

          return {
            ...current,
            myRequest: toGiveawayMyRequest(request),
          };
        });
      }

      invalidateGiveawayRelatedQueries(queryClient, authScope, giveawayId);
    },
  });
};
