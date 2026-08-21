"use client";

import { useQueryClient } from "@tanstack/react-query";

import { useApiMutation } from "@/hooks/queries/useApiMutation";
import { useAuthQueryScope } from "@/hooks/useAuthQueryScope";
import { cancelGiveawayRequest } from "@/lib/api/giveawayRequests";
import { getGiveawayRequestMyListScopeQueryKey, QUERY_KEYS } from "@/lib/constants/queryKeys";

export const useCancelGiveawayRequest = () => {
  const queryClient = useQueryClient();
  const { authScope } = useAuthQueryScope();

  return useApiMutation({
    mutationFn: cancelGiveawayRequest,
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
