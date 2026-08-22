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
    onSuccess: (data) => {
      const profile = mapMoverProfileMeResponse(data);
      saveProfileCompleted(true);
      establishSession(toAuthUserFromMoverProfile(profile));
      queryClient.setQueryData([...QUERY_KEYS.PROFILES.MOVER_ME, profile.userId] as const, profile);
    },
  });
};
