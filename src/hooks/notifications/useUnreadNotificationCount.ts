"use client";

import { useApiQuery } from "@/hooks/queries/useApiQuery";
import { useAuthQueryScope } from "@/hooks/useAuthQueryScope";
import { getUnreadNotificationCount } from "@/lib/api/notifications";
import { QUERY_KEYS } from "@/lib/constants/queryKeys";

interface UseUnreadNotificationCountOptions {
  enabled?: boolean;
}

/** GET /notifications/unread-count — 사용자 scope별 캐시 */
export function useUnreadNotificationCount(options: UseUnreadNotificationCountOptions = {}) {
  const enabled = options.enabled ?? true;
  const { authScope, isAuthenticated, isAuthQueryReady } = useAuthQueryScope();

  return useApiQuery({
    queryKey: QUERY_KEYS.NOTIFICATIONS.UNREAD_COUNT(authScope),
    queryFn: getUnreadNotificationCount,
    enabled: enabled && isAuthenticated && isAuthQueryReady,
  });
}
