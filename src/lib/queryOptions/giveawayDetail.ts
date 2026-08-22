import { queryOptions } from "@tanstack/react-query";

import { fetchGiveawayDetail } from "@/lib/api/giveaways";
import { GIVEAWAY_STATUS_STALE_TIME_MS } from "@/lib/constants/giveaway";
import { getGiveawayDetailQueryKey } from "@/lib/constants/queryKeys";

export const getGiveawayDetailQueryOptions = (giveawayId: number) => {
  return queryOptions({
    queryKey: getGiveawayDetailQueryKey(giveawayId),
    queryFn: () => fetchGiveawayDetail(giveawayId),
    staleTime: GIVEAWAY_STATUS_STALE_TIME_MS,
  });
};
