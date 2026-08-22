"use client";

import { useQueryClient } from "@tanstack/react-query";

import { useApiMutation } from "@/hooks/queries/useApiMutation";
import { useAuthQueryScope } from "@/hooks/useAuthQueryScope";
import { updateGiveaway } from "@/lib/api/giveaways";
import { invalidateGiveawayRelatedQueries } from "@/lib/queryOptions/invalidateGiveawayQueries";
import type { UpdateGiveawayInput } from "@/types/giveaway";

interface UpdateGiveawayVariables {
  giveawayId: number;
  body: UpdateGiveawayInput;
}

export const useUpdateGiveaway = () => {
  const queryClient = useQueryClient();
  const { authScope } = useAuthQueryScope();

  return useApiMutation({
    mutationFn: ({ giveawayId, body }: UpdateGiveawayVariables) => updateGiveaway(giveawayId, body),
    onSuccess: (_data, { giveawayId }) => {
      invalidateGiveawayRelatedQueries(queryClient, authScope, giveawayId);
    },
  });
};
