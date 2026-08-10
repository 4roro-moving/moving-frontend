import { useQueryClient } from "@tanstack/react-query";

import { useApiMutation } from "@/hooks/queries/useApiMutation";
import { mapCustomerProfileMeResponse, updateCustomerProfile } from "@/lib/api/profile";
import { QUERY_KEYS } from "@/lib/constants/queryKeys";
import { toAuthUserFromCustomerProfile } from "@/lib/api/profile";
import type { UpdateCustomerProfileInput } from "@/types/profile";
import { useAuthStore } from "@/stores/useAuthStore";

export const useUpdateCustomerProfile = () => {
  const queryClient = useQueryClient();
  const establishSession = useAuthStore((state) => state.establishSession);

  return useApiMutation({
    mutationFn: (input: UpdateCustomerProfileInput) => updateCustomerProfile(input),
    onSuccess: async (data) => {
      const profile = mapCustomerProfileMeResponse(data);
      establishSession(toAuthUserFromCustomerProfile(profile));

      await Promise.all([
        queryClient.invalidateQueries({ queryKey: QUERY_KEYS.PROFILES.CUSTOMER_ME }),
        queryClient.invalidateQueries({ queryKey: QUERY_KEYS.PROFILES.CUSTOMER_STATUS }),
      ]);
    },
  });
};
