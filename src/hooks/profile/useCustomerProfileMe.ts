import { useApiQuery } from "@/hooks/queries/useApiQuery";
import { getCustomerProfileMe } from "@/lib/api/profile";
import { QUERY_KEYS } from "@/lib/constants/queryKeys";
import { useAuthStore } from "@/stores/useAuthStore";

export const useCustomerProfileMe = (enabled: boolean) => {
  const userId = useAuthStore((state) => state.user?.id);

  return useApiQuery({
    queryKey: [...QUERY_KEYS.PROFILES.CUSTOMER_ME, userId ?? "anonymous"] as const,
    queryFn: getCustomerProfileMe,
    enabled: enabled && Boolean(userId),
  });
};
