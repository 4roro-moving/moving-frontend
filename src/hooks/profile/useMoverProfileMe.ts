import { useApiQuery } from "@/hooks/queries/useApiQuery";
import { getMoverProfileMe } from "@/lib/api/profile";
import { QUERY_KEYS } from "@/lib/constants/queryKeys";
import { useAuthStore } from "@/stores/useAuthStore";

export const useMoverProfileMe = (enabled: boolean) => {
  const userId = useAuthStore((state) => state.user?.id);

  return useApiQuery({
    queryKey: [...QUERY_KEYS.PROFILES.MOVER_ME, userId ?? "anonymous"] as const,
    queryFn: getMoverProfileMe,
    enabled: enabled && Boolean(userId),
  });
};
