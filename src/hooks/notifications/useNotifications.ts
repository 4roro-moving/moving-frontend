"use client";

import { useApiQuery } from "@/hooks/queries/useApiQuery";
import { useAuthQueryScope } from "@/hooks/useAuthQueryScope";
import { getNotifications, NOTIFICATION_PAGE_SIZE } from "@/lib/api/notifications";
import { QUERY_KEYS } from "@/lib/constants/queryKeys";
import type { NotificationListParams } from "@/types/notification";

interface UseNotificationsOptions extends NotificationListParams {
  enabled?: boolean;
}

/** GET /notifications — 사용자 scope별 캐시로 계정 전환 시 이전 목록이 남지 않게 합니다. */
export function useNotifications(options: UseNotificationsOptions = {}) {
  const page = options.page ?? 1;
  const limit = options.limit ?? NOTIFICATION_PAGE_SIZE;
  const enabled = options.enabled ?? true;
  const { authScope, isAuthenticated, isAuthQueryReady } = useAuthQueryScope();

  return useApiQuery({
    queryKey: QUERY_KEYS.NOTIFICATIONS.LIST(authScope, page, limit),
    queryFn: () => getNotifications({ page, limit }),
    enabled: enabled && isAuthenticated && isAuthQueryReady,
    // 같은 사용자·다른 페이지 이동 시에만 이전 데이터 유지 (계정 전환 시에는 유지하지 않음)
    placeholderData: (previousData, previousQuery) => {
      const previousScope = previousQuery?.queryKey[2];
      if (previousScope !== authScope) {
        return undefined;
      }
      return previousData;
    },
  });
}
