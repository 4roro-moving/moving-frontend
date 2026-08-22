import { useApiQuery } from "@/hooks/queries/useApiQuery";
import { useCustomerAuthReady } from "@/hooks/useCustomerAuthReady";
import { GIVEAWAY_DETAIL_REQUEST_LIMIT } from "@/lib/constants/giveaway";
import { getGiveawayRequestsQueryOptions } from "@/lib/queryOptions/giveawayRequests";
import { GIVEAWAY_LIST_SORT, GIVEAWAY_REQUEST_STATUS, GIVEAWAY_STATUS } from "@/types/giveaway";
import type { GiveawayStatus } from "@/types/giveaway";

interface UseGiveawayPendingRequestsParams {
  giveawayId: number;
  giveawayStatus: GiveawayStatus | undefined;
  enabled: boolean;
}

export const useGiveawayPendingRequests = ({
  giveawayId,
  giveawayStatus,
  enabled,
}: UseGiveawayPendingRequestsParams) => {
  const { canFetch } = useCustomerAuthReady();
  const requestStatus =
    giveawayStatus === GIVEAWAY_STATUS.IN_PROGRESS
      ? GIVEAWAY_REQUEST_STATUS.SELECTED
      : GIVEAWAY_REQUEST_STATUS.PENDING;

  return useApiQuery({
    ...getGiveawayRequestsQueryOptions(giveawayId, {
      status: requestStatus,
      sort: GIVEAWAY_LIST_SORT.LATEST,
      limit: GIVEAWAY_DETAIL_REQUEST_LIMIT,
    }),
    enabled:
      enabled &&
      canFetch &&
      Number.isInteger(giveawayId) &&
      giveawayId > 0 &&
      giveawayStatus !== undefined &&
      giveawayStatus !== GIVEAWAY_STATUS.COMPLETED,
  });
};
