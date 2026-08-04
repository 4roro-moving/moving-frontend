import { useQueryClient } from "@tanstack/react-query";

import { useApiMutation } from "@/hooks/queries/useApiMutation";
import {
  mapCustomerProfileMeResponse,
  toAuthUserFromCustomerProfile,
  updateCustomerBasicInfo,
} from "@/lib/api/profile";
import { QUERY_KEYS } from "@/lib/constants/queryKeys";
import { useAuthStore } from "@/stores/useAuthStore";
import type { UpdateCustomerBasicInfoInput } from "@/types/profile";

export const useUpdateCustomerBasicInfo = () => {
  const queryClient = useQueryClient();
  const establishSession = useAuthStore((state) => state.establishSession);

  return useApiMutation({
    mutationFn: (input: UpdateCustomerBasicInfoInput) => updateCustomerBasicInfo(input),
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
