import { useQueryClient } from "@tanstack/react-query";

import { useApiMutation } from "@/hooks/queries/useApiMutation";
import {
  mapCustomerProfileMeResponse,
  toAuthUserFromCustomerProfile,
  updateCustomerBasicInfo,
} from "@/lib/api/profile";
import { QUERY_KEYS } from "@/lib/constants/queryKeys";
import { getAuthSessionSnapshot, isAuthSessionCurrent, useAuthStore } from "@/stores/useAuthStore";
import type { UpdateCustomerBasicInfoInput } from "@/types/profile";

export const useUpdateCustomerBasicInfo = () => {
  const queryClient = useQueryClient();
  const establishSession = useAuthStore((state) => state.establishSession);

  return useApiMutation({
    mutationFn: (input: UpdateCustomerBasicInfoInput) => updateCustomerBasicInfo(input),
    onMutate: () => ({ sessionSnapshot: getAuthSessionSnapshot() }),
    onSuccess: (data, _variables, context) => {
      if (!context || !isAuthSessionCurrent(context.sessionSnapshot)) return;

      const profile = mapCustomerProfileMeResponse(data);
      const currentUserId = useAuthStore.getState().user?.id;
      if (
        (context.sessionSnapshot.userId !== null &&
          profile.userId !== context.sessionSnapshot.userId) ||
        (currentUserId != null && profile.userId !== currentUserId)
      ) {
        return;
      }

      establishSession(toAuthUserFromCustomerProfile(profile));
      queryClient.setQueryData(
        [...QUERY_KEYS.PROFILES.CUSTOMER_ME, profile.userId] as const,
        profile,
      );
    },
  });
};
