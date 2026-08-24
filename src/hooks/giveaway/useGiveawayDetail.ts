import { useApiQuery } from "@/hooks/queries/useApiQuery";
import { useAuthQueryScope } from "@/hooks/useAuthQueryScope";
import { useCustomerAuthReady } from "@/hooks/useCustomerAuthReady";
import { getGiveawayDetailQueryOptions } from "@/lib/queryOptions/giveawayDetail";

export const useGiveawayDetail = (giveawayId: number) => {
  const { canFetch } = useCustomerAuthReady();
  const { authScope, isAuthQueryReady } = useAuthQueryScope();

  return useApiQuery({
    ...getGiveawayDetailQueryOptions(authScope, giveawayId),
    enabled: canFetch && isAuthQueryReady && Number.isInteger(giveawayId) && giveawayId > 0,
  });
};
