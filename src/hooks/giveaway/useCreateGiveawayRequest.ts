"use client";

import { useQueryClient } from "@tanstack/react-query";

import { useApiMutation } from "@/hooks/queries/useApiMutation";
import { useAuthQueryScope } from "@/hooks/useAuthQueryScope";
import { createGiveawayRequest } from "@/lib/api/giveawayRequests";
import {
  patchGiveawayDetailQueryData,
  toGiveawayMyRequest,
} from "@/lib/queryOptions/giveawayCache";
import { invalidateGiveawayRelatedQueries } from "@/lib/queryOptions/invalidateGiveawayQueries";
import type { CreateGiveawayRequestInput } from "@/types/giveaway";

interface CreateGiveawayRequestVariables {
  giveawayId: number;
  body: CreateGiveawayRequestInput;
}

export const useCreateGiveawayRequest = () => {
  const queryClient = useQueryClient();
  const { authScope } = useAuthQueryScope();

  return useApiMutation({
    mutationFn: ({ giveawayId, body }: CreateGiveawayRequestVariables) =>
      createGiveawayRequest(giveawayId, body),
    onSuccess: (request, { giveawayId }) => {
      patchGiveawayDetailQueryData(queryClient, giveawayId, (current) => ({
        ...current,
        canRequest: false,
        activeRequestCount: current.activeRequestCount + 1,
        myRequest: toGiveawayMyRequest(request),
      }));
      invalidateGiveawayRelatedQueries(queryClient, authScope, giveawayId);
    },
  });
};
