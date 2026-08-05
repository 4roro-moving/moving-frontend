import { useQueryClient } from "@tanstack/react-query";

import { useApiMutation } from "@/hooks/queries/useApiMutation";
import { updateMoverProfile } from "@/lib/api/profile";
import { QUERY_KEYS } from "@/lib/constants/queryKeys";
import type { UpdateMoverProfileInput } from "@/types/profile";

export const useUpdateMoverProfile = () => {
  const queryClient = useQueryClient();

  return useApiMutation({
    mutationFn: (input: UpdateMoverProfileInput) => updateMoverProfile(input),
    onSuccess: async () => {
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: QUERY_KEYS.PROFILES.MOVER_ME }),
        queryClient.invalidateQueries({ queryKey: QUERY_KEYS.PROFILES.MOVER_STATUS }),
      ]);
    },
  });
};
