import { useQueryClient } from "@tanstack/react-query";

import { useApiMutation } from "@/hooks/queries/useApiMutation";
import {
  mapMoverProfileMeResponse,
  toAuthUserFromMoverProfile,
  updateMoverBasicInfo,
} from "@/lib/api/profile";
import { QUERY_KEYS } from "@/lib/constants/queryKeys";
import { getAuthSessionSnapshot, isAuthSessionCurrent, useAuthStore } from "@/stores/useAuthStore";
import type { UpdateMoverBasicInfoInput } from "@/types/profile";

export const useUpdateMoverBasicInfo = () => {
  const queryClient = useQueryClient();
  const establishSession = useAuthStore((state) => state.establishSession);

  return useApiMutation({
    mutationFn: (input: UpdateMoverBasicInfoInput) => updateMoverBasicInfo(input),
    onMutate: () => ({ sessionSnapshot: getAuthSessionSnapshot() }),
    onSuccess: (data, _variables, context) => {
      if (!context || !isAuthSessionCurrent(context.sessionSnapshot)) return;

      const profile = mapMoverProfileMeResponse(data);
      const currentUserId = useAuthStore.getState().user?.id;
      if (
        (context.sessionSnapshot.userId !== null &&
          profile.userId !== context.sessionSnapshot.userId) ||
        (currentUserId != null && profile.userId !== currentUserId)
      ) {
        return;
      }

      establishSession(toAuthUserFromMoverProfile(profile));
      queryClient.setQueryData([...QUERY_KEYS.PROFILES.MOVER_ME, profile.userId] as const, profile);
    },
  });
};
