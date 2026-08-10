import { useQueryClient } from "@tanstack/react-query";

import { useApiMutation } from "@/hooks/queries/useApiMutation";
import {
  mapMoverProfileMeResponse,
  toAuthUserFromMoverProfile,
  updateMoverProfile,
} from "@/lib/api/profile";
import { QUERY_KEYS } from "@/lib/constants/queryKeys";
import type { UpdateMoverProfileInput } from "@/types/profile";
import { useAuthStore } from "@/stores/useAuthStore";

export const useUpdateMoverProfile = () => {
  const queryClient = useQueryClient();
  const establishSession = useAuthStore((state) => state.establishSession);

  return useApiMutation({
    mutationFn: (input: UpdateMoverProfileInput) => updateMoverProfile(input),
    onSuccess: (data) => {
      const profile = mapMoverProfileMeResponse(data);
      establishSession(toAuthUserFromMoverProfile(profile));
      queryClient.setQueryData([...QUERY_KEYS.PROFILES.MOVER_ME, profile.userId] as const, profile);
    },
  });
};
