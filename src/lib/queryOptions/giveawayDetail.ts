import { queryOptions } from "@tanstack/react-query";

import { fetchGiveawayDetail } from "@/lib/api/giveaways";
import { GIVEAWAY_STATUS_STALE_TIME_MS } from "@/lib/constants/giveaway";
import { getGiveawayDetailQueryKey, type AuthQueryScope } from "@/lib/constants/queryKeys";

export const getGiveawayDetailQueryOptions = (authScope: AuthQueryScope, giveawayId: number) => {
  return queryOptions({
    queryKey: getGiveawayDetailQueryKey(authScope, giveawayId),
    queryFn: () => fetchGiveawayDetail(giveawayId),
    staleTime: GIVEAWAY_STATUS_STALE_TIME_MS,
  });
};
