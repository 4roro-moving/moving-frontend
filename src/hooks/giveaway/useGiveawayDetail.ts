import { useApiQuery } from "@/hooks/queries/useApiQuery";
import { useCustomerAuthReady } from "@/hooks/useCustomerAuthReady";
import { getGiveawayDetailQueryOptions } from "@/lib/queryOptions/giveawayDetail";

export const useGiveawayDetail = (giveawayId: number) => {
  const { canFetch } = useCustomerAuthReady();

  return useApiQuery({
    ...getGiveawayDetailQueryOptions(giveawayId),
    enabled: canFetch && Number.isInteger(giveawayId) && giveawayId > 0,
  });
};
