"use client";

import { useQueryClient } from "@tanstack/react-query";

import { useApiMutation } from "@/hooks/queries/useApiMutation";
import { createGiveaway } from "@/lib/api/giveaways";
import { QUERY_KEYS } from "@/lib/constants/queryKeys";
import type { CreateGiveawayInput } from "@/types/giveaway";

export const useCreateGiveaway = () => {
  const queryClient = useQueryClient();

  return useApiMutation({
    mutationFn: (body: CreateGiveawayInput) => createGiveaway(body),
    onSuccess: () => {
      void queryClient.invalidateQueries({
        queryKey: QUERY_KEYS.GIVEAWAYS.ALL,
      });
    },
  });
};
