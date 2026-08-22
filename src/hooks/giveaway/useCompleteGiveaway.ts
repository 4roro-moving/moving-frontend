"use client";

import { useQueryClient } from "@tanstack/react-query";

import { useApiMutation } from "@/hooks/queries/useApiMutation";
import { useAuthQueryScope } from "@/hooks/useAuthQueryScope";
import { completeGiveaway } from "@/lib/api/giveaways";
import { invalidateGiveawayRelatedQueries } from "@/lib/queryOptions/invalidateGiveawayQueries";

export const useCompleteGiveaway = () => {
  const queryClient = useQueryClient();
  const { authScope } = useAuthQueryScope();

  return useApiMutation({
    mutationFn: completeGiveaway,
    onSuccess: (_data, giveawayId) => {
      invalidateGiveawayRelatedQueries(queryClient, authScope, giveawayId);
    },
  });
};
