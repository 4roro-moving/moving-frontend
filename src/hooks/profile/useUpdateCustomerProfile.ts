import { useQueryClient } from "@tanstack/react-query";

import { useApiMutation } from "@/hooks/queries/useApiMutation";
import { updateCustomerProfile } from "@/lib/api/profile";
import { QUERY_KEYS } from "@/lib/constants/queryKeys";
import type { UpdateCustomerProfileInput } from "@/types/profile";

export const useUpdateCustomerProfile = () => {
  const queryClient = useQueryClient();

  return useApiMutation({
    mutationFn: (input: UpdateCustomerProfileInput) => updateCustomerProfile(input),
    onSuccess: async () => {
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: QUERY_KEYS.PROFILES.CUSTOMER_ME }),
        queryClient.invalidateQueries({ queryKey: QUERY_KEYS.PROFILES.CUSTOMER_STATUS }),
      ]);
    },
  });
};
