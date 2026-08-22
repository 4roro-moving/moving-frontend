import { useApiQuery } from "@/hooks/queries/useApiQuery";
import { useCustomerAuthReady } from "@/hooks/useCustomerAuthReady";
import { GIVEAWAY_DETAIL_REQUEST_LIMIT } from "@/lib/constants/giveaway";
import { getGiveawayRequestsQueryOptions } from "@/lib/queryOptions/giveawayRequests";
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

  return useApiQuery({
    ...getGiveawayRequestsQueryOptions(giveawayId, {
      sort: GIVEAWAY_LIST_SORT.LATEST,
      limit: GIVEAWAY_DETAIL_REQUEST_LIMIT,
    }),
    enabled: enabled && canFetch && Number.isInteger(giveawayId) && giveawayId > 0,
  });
};
