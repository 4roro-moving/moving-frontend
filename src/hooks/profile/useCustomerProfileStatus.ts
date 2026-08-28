import { useApiQuery } from "@/hooks/queries/useApiQuery";
import { getCustomerProfileStatus } from "@/lib/api/profile";
import { saveProfileCompleted } from "@/lib/auth/profileCompleted";
import { QUERY_KEYS } from "@/lib/constants/queryKeys";
import { useAuthStore } from "@/stores/useAuthStore";

export const useCustomerProfileStatus = (enabled: boolean) => {
  const userId = useAuthStore((state) => state.user?.id);

  return useApiQuery({
    queryKey: [...QUERY_KEYS.PROFILES.CUSTOMER_STATUS, userId ?? "anonymous"] as const,
    queryFn: async () => {
      const status = await getCustomerProfileStatus();
      saveProfileCompleted(status.isProfileCompleted);
      return status;
    },
    enabled: enabled && Boolean(userId),
  });
};
