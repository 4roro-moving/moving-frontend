import { useApiQuery } from "@/hooks/queries/useApiQuery";
import { getMoverProfileStatus } from "@/lib/api/profile";
import { QUERY_KEYS } from "@/lib/constants/queryKeys";

export const useMoverProfileStatus = (enabled: boolean) => {
  return useApiQuery({
    queryKey: QUERY_KEYS.PROFILES.MOVER_STATUS,
    queryFn: getMoverProfileStatus,
    enabled,
  });
};
