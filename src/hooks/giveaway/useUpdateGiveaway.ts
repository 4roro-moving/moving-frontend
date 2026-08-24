"use client";

import { useQueryClient } from "@tanstack/react-query";

import { useApiMutation } from "@/hooks/queries/useApiMutation";
import { useAuthQueryScope } from "@/hooks/useAuthQueryScope";
import { updateGiveaway } from "@/lib/api/giveaways";
import { setGiveawayDetailQueryData } from "@/lib/queryOptions/giveawayCache";
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
    onSuccess: (detail, { giveawayId }) => {
      setGiveawayDetailQueryData(queryClient, authScope, giveawayId, detail);
      invalidateGiveawayRelatedQueries(queryClient, authScope, giveawayId);
    },
  });
};
