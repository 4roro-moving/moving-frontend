import { useApiQuery } from "@/hooks/queries/useApiQuery";
import { getMoverProfileStatus } from "@/lib/api/profile";
import { saveProfileCompleted } from "@/lib/auth/profileCompleted";
import { QUERY_KEYS } from "@/lib/constants/queryKeys";
import { useAuthStore } from "@/stores/useAuthStore";

export const useMoverProfileStatus = (enabled: boolean) => {
  const userId = useAuthStore((state) => state.user?.id);

  return useApiQuery({
    queryKey: [...QUERY_KEYS.PROFILES.MOVER_STATUS, userId ?? "anonymous"] as const,
    queryFn: async () => {
      const status = await getMoverProfileStatus();
      saveProfileCompleted(status.isProfileCompleted);
      return status;
    },
    enabled: enabled && Boolean(userId),
  });
};
