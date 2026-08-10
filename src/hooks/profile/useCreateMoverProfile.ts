import { useQueryClient } from "@tanstack/react-query";

import { useApiMutation } from "@/hooks/queries/useApiMutation";
import {
  createMoverProfile,
  mapMoverProfileMeResponse,
  toAuthUserFromMoverProfile,
} from "@/lib/api/profile";
import { saveProfileCompleted } from "@/lib/auth/profileCompleted";
import { QUERY_KEYS } from "@/lib/constants/queryKeys";
import type { CreateMoverProfileInput } from "@/types/profile";
import { useAuthStore } from "@/stores/useAuthStore";

export const useCreateMoverProfile = () => {
  const queryClient = useQueryClient();
  const establishSession = useAuthStore((state) => state.establishSession);

  return useApiMutation({
    mutationFn: (input: CreateMoverProfileInput) => createMoverProfile(input),
    onSuccess: async (data) => {
      const profile = mapMoverProfileMeResponse(data);
      saveProfileCompleted(true);
      establishSession(toAuthUserFromMoverProfile(profile));
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: QUERY_KEYS.PROFILES.MOVER_ME }),
        queryClient.invalidateQueries({ queryKey: QUERY_KEYS.PROFILES.MOVER_STATUS }),
      ]);
    },
  });
};
