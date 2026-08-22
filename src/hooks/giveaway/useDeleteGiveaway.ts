"use client";

import { useQueryClient } from "@tanstack/react-query";

import { useApiMutation } from "@/hooks/queries/useApiMutation";
import { useAuthQueryScope } from "@/hooks/useAuthQueryScope";
import { deleteGiveaway } from "@/lib/api/giveaways";
import { invalidateGiveawayRelatedQueries } from "@/lib/queryOptions/invalidateGiveawayQueries";

export const useDeleteGiveaway = () => {
  const queryClient = useQueryClient();
  const { authScope } = useAuthQueryScope();

  return useApiMutation({
    mutationFn: deleteGiveaway,
    onSuccess: (_data, giveawayId) => {
      invalidateGiveawayRelatedQueries(queryClient, authScope, giveawayId);
    },
  });
};
