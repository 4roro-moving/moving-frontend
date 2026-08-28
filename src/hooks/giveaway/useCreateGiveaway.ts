"use client";

import { useQueryClient } from "@tanstack/react-query";

import { useApiMutation } from "@/hooks/queries/useApiMutation";
import { createGiveaway } from "@/lib/api/giveaways";
import { invalidateGiveawayLists } from "@/lib/queryOptions/invalidateGiveawayQueries";
import type { CreateGiveawayInput } from "@/types/giveaway";

export const useCreateGiveaway = () => {
  const queryClient = useQueryClient();

  return useApiMutation({
    mutationFn: (body: CreateGiveawayInput) => createGiveaway(body),
    onSuccess: () => {
      invalidateGiveawayLists(queryClient);
    },
  });
};
