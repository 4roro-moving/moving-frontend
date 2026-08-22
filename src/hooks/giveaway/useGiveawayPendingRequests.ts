"use client";

import { useCursorListQuery } from "@/hooks/queries/useCursorListQuery";
import { useCustomerAuthReady } from "@/hooks/useCustomerAuthReady";
import { GIVEAWAY_PAGE_LIMIT } from "@/lib/constants/giveaway";
import { getGiveawayRequestsInfiniteQueryOptions } from "@/lib/queryOptions/giveawayRequests";
import { GIVEAWAY_LIST_SORT } from "@/types/giveaway";

interface UseGiveawayPendingRequestsParams {
  giveawayId: number;
  enabled: boolean;
}

export const useGiveawayPendingRequests = ({
  giveawayId,
  enabled,
}: UseGiveawayPendingRequestsParams) => {
  const { canFetch } = useCustomerAuthReady();

  const {
    items: requests,
    isInitialLoading,
    isFilterFetching,
    query,
  } = useCursorListQuery({
    ...getGiveawayRequestsInfiniteQueryOptions(giveawayId, {
      sort: GIVEAWAY_LIST_SORT.LATEST,
      limit: GIVEAWAY_PAGE_LIMIT,
    }),
    enabled: enabled && canFetch && Number.isInteger(giveawayId) && giveawayId > 0,
  });

  return { requests, isInitialLoading, isFilterFetching, query };
};
