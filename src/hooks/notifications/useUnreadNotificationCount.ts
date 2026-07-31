"use client";

import { useApiQuery } from "@/hooks/queries/useApiQuery";
import { getUnreadNotificationCount } from "@/lib/api/notifications";
import { QUERY_KEYS } from "@/lib/constants/queryKeys";

interface UseUnreadNotificationCountOptions {
  enabled?: boolean;
}

/** GET /notifications/unread-count */
export function useUnreadNotificationCount(options: UseUnreadNotificationCountOptions = {}) {
  const enabled = options.enabled ?? true;

  return useApiQuery({
    queryKey: QUERY_KEYS.NOTIFICATIONS.UNREAD_COUNT,
    queryFn: getUnreadNotificationCount,
    enabled,
  });
}
