import { useQueryClient } from "@tanstack/react-query";

import { useApiMutation } from "@/hooks/queries/useApiMutation";
import { updateMoverBasicInfo } from "@/lib/api/profile";
import { QUERY_KEYS } from "@/lib/constants/queryKeys";
import type { UpdateMoverBasicInfoInput } from "@/types/profile";

export const useUpdateMoverBasicInfo = () => {
  const queryClient = useQueryClient();

  return useApiMutation({
    mutationFn: (input: UpdateMoverBasicInfoInput) => updateMoverBasicInfo(input),
    onSuccess: async () => {
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: QUERY_KEYS.PROFILES.MOVER_ME }),
        queryClient.invalidateQueries({ queryKey: QUERY_KEYS.PROFILES.MOVER_STATUS }),
      ]);
    },
  });
};
