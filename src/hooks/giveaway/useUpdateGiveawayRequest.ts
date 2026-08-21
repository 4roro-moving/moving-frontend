"use client";

import { useQueryClient } from "@tanstack/react-query";

import { useApiMutation } from "@/hooks/queries/useApiMutation";
import { useAuthQueryScope } from "@/hooks/useAuthQueryScope";
import { updateGiveawayRequest } from "@/lib/api/giveawayRequests";
import { getGiveawayRequestMyListScopeQueryKey, QUERY_KEYS } from "@/lib/constants/queryKeys";
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
      void queryClient.invalidateQueries({
        queryKey: getGiveawayRequestMyListScopeQueryKey(authScope),
      });
      void queryClient.invalidateQueries({
        queryKey: QUERY_KEYS.GIVEAWAYS.ALL,
      });
    },
  });
};
