"use client";

import { useQueryClient } from "@tanstack/react-query";

import { useApiMutation } from "@/hooks/queries/useApiMutation";
import { useAuthQueryScope } from "@/hooks/useAuthQueryScope";
import { updateGiveawayRequest } from "@/lib/api/giveawayRequests";
import { invalidateGiveawayRequestLists } from "@/lib/queryOptions/invalidateGiveawayQueries";
import type { UpdateGiveawayRequestInput } from "@/types/giveaway";

interface UpdateGiveawayRequestVariables {
  requestId: number;
  body: UpdateGiveawayRequestInput;
}

export const useUpdateGiveawayRequest = () => {
  const queryClient = useQueryClient();
  const { authScope } = useAuthQueryScope();

  return useApiMutation({
    mutationFn: ({ requestId, body }: UpdateGiveawayRequestVariables) =>
      updateGiveawayRequest(requestId, body),
    onSuccess: () => {
      invalidateGiveawayRequestLists(queryClient, authScope);
    },
  });
};
