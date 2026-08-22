"use client";

import { useQueryClient } from "@tanstack/react-query";

import { useApiMutation } from "@/hooks/queries/useApiMutation";
import { useAuthQueryScope } from "@/hooks/useAuthQueryScope";
import { selectGiveawayRequest } from "@/lib/api/giveawayRequests";
import { setGiveawayDetailQueryData } from "@/lib/queryOptions/giveawayCache";
import { invalidateGiveawayRelatedQueries } from "@/lib/queryOptions/invalidateGiveawayQueries";

interface SelectGiveawayRequestVariables {
  giveawayId: number;
  requestId: number;
}

export const useSelectGiveawayRequest = () => {
  const queryClient = useQueryClient();
  const { authScope } = useAuthQueryScope();

  return useApiMutation({
    mutationFn: ({ giveawayId, requestId }: SelectGiveawayRequestVariables) =>
      selectGiveawayRequest(giveawayId, requestId),
    onSuccess: (detail, { giveawayId }) => {
      setGiveawayDetailQueryData(queryClient, giveawayId, detail);
      invalidateGiveawayRelatedQueries(queryClient, authScope, giveawayId);
    },
  });
};
