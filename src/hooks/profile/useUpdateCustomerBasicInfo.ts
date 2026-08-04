import { useQueryClient } from "@tanstack/react-query";

import { useApiMutation } from "@/hooks/queries/useApiMutation";
import { updateCustomerBasicInfo } from "@/lib/api/profile";
import { QUERY_KEYS } from "@/lib/constants/queryKeys";
import type { UpdateCustomerBasicInfoInput } from "@/types/profile";

export const useUpdateCustomerBasicInfo = () => {
  const queryClient = useQueryClient();

  return useApiMutation({
    mutationFn: (input: UpdateCustomerBasicInfoInput) => updateCustomerBasicInfo(input),
    onSuccess: async () => {
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: QUERY_KEYS.PROFILES.CUSTOMER_ME }),
        queryClient.invalidateQueries({ queryKey: QUERY_KEYS.PROFILES.CUSTOMER_STATUS }),
      ]);
    },
  });
};
