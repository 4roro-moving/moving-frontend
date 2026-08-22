"use client";

import { useQueryClient } from "@tanstack/react-query";

import { useApiMutation } from "@/hooks/queries/useApiMutation";
import { useAuthQueryScope } from "@/hooks/useAuthQueryScope";
import { createGiveawayRequest } from "@/lib/api/giveawayRequests";
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
    onSuccess: (_data, { giveawayId }) => {
      invalidateGiveawayRelatedQueries(queryClient, authScope, giveawayId);
    },
  });
};
