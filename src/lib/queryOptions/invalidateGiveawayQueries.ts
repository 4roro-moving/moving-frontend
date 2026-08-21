import type { QueryClient } from "@tanstack/react-query";

import { getGiveawayRequestMyListScopeQueryKey, QUERY_KEYS } from "@/lib/constants/queryKeys";
import type { AuthQueryScope } from "@/lib/constants/queryKeys";

export const invalidateGiveawayLists = (queryClient: QueryClient) => {
  void queryClient.invalidateQueries({
    queryKey: QUERY_KEYS.GIVEAWAYS.ALL,
  });
};

export const invalidateGiveawayRelatedQueries = (
  queryClient: QueryClient,
  authScope: AuthQueryScope,
) => {
  void queryClient.invalidateQueries({
    queryKey: getGiveawayRequestMyListScopeQueryKey(authScope),
  });
  invalidateGiveawayLists(queryClient);
};
