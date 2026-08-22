"use client";

import { useApiQuery } from "@/hooks/queries/useApiQuery";
import { useAuthQueryScope } from "@/hooks/useAuthQueryScope";
import { getMyContentDetail } from "@/lib/api/myContents";
import { QUERY_KEYS } from "@/lib/constants/queryKeys";
import type { MyContentType } from "@/types/myContent";

interface UseMyContentDetailOptions {
  contentType: MyContentType;
  contentId: number;
  enabled?: boolean;
}

export function useMyContentDetail({
  contentType,
  contentId,
  enabled = true,
}: UseMyContentDetailOptions) {
  const { authScope, isAuthQueryReady } = useAuthQueryScope();

  return useApiQuery({
    queryKey: QUERY_KEYS.MY_CONTENTS.DETAIL(authScope, contentType, contentId),
    queryFn: () => getMyContentDetail(contentType, contentId),
    enabled: enabled && isAuthQueryReady && contentId > 0,
  });
}
