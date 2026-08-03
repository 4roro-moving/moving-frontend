import { useApiQuery } from "@/hooks/queries/useApiQuery";
import { getCustomerProfileStatus } from "@/lib/api/profile";
import { QUERY_KEYS } from "@/lib/constants/queryKeys";

export const useCustomerProfileStatus = (enabled: boolean) => {
  return useApiQuery({
    queryKey: QUERY_KEYS.PROFILES.CUSTOMER_STATUS,
    queryFn: getCustomerProfileStatus,
    enabled,
  });
};
