"use client";

import { useQueryClient } from "@tanstack/react-query";

import { useApiMutation } from "@/hooks/queries/useApiMutation";
import { useAuthQueryScope } from "@/hooks/useAuthQueryScope";
import { selectGiveawayRequest } from "@/lib/api/giveawayRequests";
import {
  patchGiveawayRequestsQueryData,
  patchMyGiveawayRequestQueryData,
  setGiveawayDetailQueryData,
} from "@/lib/queryOptions/giveawayCache";
import { invalidateGiveawayRelatedQueries } from "@/lib/queryOptions/invalidateGiveawayQueries";
import { GIVEAWAY_REQUEST_STATUS } from "@/types/giveaway";

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
    onSuccess: (detail, { giveawayId, requestId }) => {
      setGiveawayDetailQueryData(queryClient, authScope, giveawayId, detail);
      patchGiveawayRequestsQueryData(queryClient, giveawayId, (item) =>
        item.id === requestId ? { ...item, status: GIVEAWAY_REQUEST_STATUS.SELECTED } : item,
      );
      patchMyGiveawayRequestQueryData(queryClient, authScope, requestId, (item) => ({
        ...item,
        status: GIVEAWAY_REQUEST_STATUS.SELECTED,
        giveaway: {
          ...item.giveaway,
          status: detail.status,
        },
      }));
      invalidateGiveawayRelatedQueries(queryClient, authScope, giveawayId);
    },
  });
};
