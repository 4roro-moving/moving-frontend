"use client";

import { useQueryClient } from "@tanstack/react-query";

import { useApiMutation } from "@/hooks/queries/useApiMutation";
import { useAuthQueryScope } from "@/hooks/useAuthQueryScope";
import { createReport } from "@/lib/api/reports";
import { QUERY_KEYS } from "@/lib/constants/queryKeys";
import { uploadReportImages } from "@/lib/report/uploadReportImages";
import type { CreateReportInput } from "@/types/report";

interface CreateReportMutationInput extends Omit<CreateReportInput, "imageKeys"> {
  images: File[];
}

export function useCreateReport() {
  const queryClient = useQueryClient();
  const { authScope } = useAuthQueryScope();

  return useApiMutation({
    mutationFn: async ({ images, ...input }: CreateReportMutationInput) => {
      const imageKeys = images.length > 0 ? await uploadReportImages(images) : undefined;

      return createReport({
        ...input,
        imageKeys,
      });
    },

    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: QUERY_KEYS.REPORTS.ME_ROOT(authScope),
      });
    },
  });
}
