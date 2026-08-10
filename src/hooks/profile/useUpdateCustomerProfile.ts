import { useQueryClient } from "@tanstack/react-query";

import { useApiMutation } from "@/hooks/queries/useApiMutation";
import {
  mapCustomerProfileMeResponse,
  toAuthUserFromCustomerProfile,
  updateCustomerProfile,
} from "@/lib/api/profile";
import { QUERY_KEYS } from "@/lib/constants/queryKeys";
import { useAuthStore } from "@/stores/useAuthStore";
import type { UpdateCustomerProfileInput } from "@/types/profile";

export const useUpdateCustomerProfile = () => {
  const queryClient = useQueryClient();
  const establishSession = useAuthStore((state) => state.establishSession);

  return useApiMutation({
    mutationFn: (input: UpdateCustomerProfileInput) => updateCustomerProfile(input),
    onSuccess: (data) => {
      const profile = mapCustomerProfileMeResponse(data);
      establishSession(toAuthUserFromCustomerProfile(profile));
      queryClient.setQueryData(
        [...QUERY_KEYS.PROFILES.CUSTOMER_ME, profile.userId] as const,
        profile,
      );
    },
  });
};
