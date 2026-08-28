import type { QueryClient } from "@tanstack/react-query";

import {
  getGiveawayDetailQueryKey,
  getGiveawayRequestMyListScopeQueryKey,
  getGiveawayRequestsScopeQueryKey,
  QUERY_KEYS,
} from "@/lib/constants/queryKeys";
import type { AuthQueryScope } from "@/lib/constants/queryKeys";

export const invalidateGiveawayLists = (queryClient: QueryClient) => {
  void queryClient.invalidateQueries({
    queryKey: QUERY_KEYS.GIVEAWAYS.ALL,
  });
};

export const invalidateGiveawayDetail = (
  queryClient: QueryClient,
  authScope: AuthQueryScope,
  giveawayId: number,
) => {
  void queryClient.invalidateQueries({
    queryKey: getGiveawayDetailQueryKey(authScope, giveawayId),
  });
};

export const invalidateGiveawayRequests = (queryClient: QueryClient, giveawayId: number) => {
  void queryClient.invalidateQueries({
    queryKey: getGiveawayRequestsScopeQueryKey(giveawayId),
  });
};

export const invalidateGiveawayRequestLists = (
  queryClient: QueryClient,
  authScope: AuthQueryScope,
) => {
  void queryClient.invalidateQueries({
    queryKey: getGiveawayRequestMyListScopeQueryKey(authScope),
  });
};

export const invalidateGiveawayRelatedQueries = (
  queryClient: QueryClient,
  authScope: AuthQueryScope,
  giveawayId?: number,
) => {
  invalidateGiveawayRequestLists(queryClient, authScope);
  invalidateGiveawayLists(queryClient);

  if (giveawayId !== undefined) {
    invalidateGiveawayDetail(queryClient, authScope, giveawayId);
    invalidateGiveawayRequests(queryClient, giveawayId);
  }
};
