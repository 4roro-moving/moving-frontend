import { useQueryClient } from "@tanstack/react-query";

import { useApiMutation } from "@/hooks/queries/useApiMutation";
import {
  createCustomerProfile,
  mapCustomerProfileMeResponse,
  toAuthUserFromCustomerProfile,
} from "@/lib/api/profile";
import { saveProfileCompleted } from "@/lib/auth/profileCompleted";
import { QUERY_KEYS } from "@/lib/constants/queryKeys";
import type { CreateCustomerProfileInput } from "@/types/profile";
import { useAuthStore } from "@/stores/useAuthStore";

export const useCreateCustomerProfile = () => {
  const queryClient = useQueryClient();
  const establishSession = useAuthStore((state) => state.establishSession);

  return useApiMutation({
    mutationFn: (input: CreateCustomerProfileInput) => createCustomerProfile(input),
    onSuccess: async (data) => {
      const profile = mapCustomerProfileMeResponse(data);
      saveProfileCompleted(true);
      establishSession(toAuthUserFromCustomerProfile(profile));
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: QUERY_KEYS.PROFILES.CUSTOMER_ME }),
        queryClient.invalidateQueries({ queryKey: QUERY_KEYS.PROFILES.CUSTOMER_STATUS }),
      ]);
    },
  });
};
