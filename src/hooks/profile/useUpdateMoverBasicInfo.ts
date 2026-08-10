import { useQueryClient } from "@tanstack/react-query";

import { useApiMutation } from "@/hooks/queries/useApiMutation";
import {
  mapMoverProfileMeResponse,
  toAuthUserFromMoverProfile,
  updateMoverBasicInfo,
} from "@/lib/api/profile";
import { QUERY_KEYS } from "@/lib/constants/queryKeys";
import { useAuthStore } from "@/stores/useAuthStore";
import type { UpdateMoverBasicInfoInput } from "@/types/profile";

export const useUpdateMoverBasicInfo = () => {
  const queryClient = useQueryClient();
  const establishSession = useAuthStore((state) => state.establishSession);

  return useApiMutation({
    mutationFn: (input: UpdateMoverBasicInfoInput) => updateMoverBasicInfo(input),
    onSuccess: (data) => {
      const profile = mapMoverProfileMeResponse(data);
      establishSession(toAuthUserFromMoverProfile(profile));
      queryClient.setQueryData([...QUERY_KEYS.PROFILES.MOVER_ME, profile.userId] as const, profile);
    },
  });
};
