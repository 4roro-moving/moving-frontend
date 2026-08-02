import { useApiQuery } from "@/hooks/queries/useApiQuery";
import { getMoverProfileMe } from "@/lib/api/profile";
import { QUERY_KEYS } from "@/lib/constants/queryKeys";

export const useMoverProfileMe = (enabled: boolean) => {
  return useApiQuery({
    queryKey: QUERY_KEYS.PROFILES.MOVER_ME,
    queryFn: getMoverProfileMe,
    enabled,
  });
};
