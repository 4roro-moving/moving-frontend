import { useQueryClient } from "@tanstack/react-query";

import { useApiMutation } from "@/hooks/queries/useApiMutation";
import { createMoverProfile } from "@/lib/api/profile";
import { QUERY_KEYS } from "@/lib/constants/queryKeys";
import type { CreateMoverProfileInput } from "@/types/profile";

export const useCreateMoverProfile = () => {
  const queryClient = useQueryClient();

  return useApiMutation({
    mutationFn: (input: CreateMoverProfileInput) => createMoverProfile(input),
    onSuccess: async () => {
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: QUERY_KEYS.PROFILES.MOVER_ME }),
        queryClient.invalidateQueries({ queryKey: QUERY_KEYS.PROFILES.MOVER_STATUS }),
      ]);
    },
  });
};
