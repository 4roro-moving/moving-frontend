import { useApiQuery } from "@/hooks/queries/useApiQuery";
import { getCustomerProfileMe } from "@/lib/api/profile";
import { QUERY_KEYS } from "@/lib/constants/queryKeys";

export const useCustomerProfileMe = (enabled: boolean) => {
  return useApiQuery({
    queryKey: QUERY_KEYS.PROFILES.CUSTOMER_ME,
    queryFn: getCustomerProfileMe,
    enabled,
  });
};
