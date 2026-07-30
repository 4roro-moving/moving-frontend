"use client";

import { keepPreviousData } from "@tanstack/react-query";

import { useApiQuery } from "@/hooks/queries/useApiQuery";
import { getNotifications, NOTIFICATION_PAGE_SIZE } from "@/lib/api/notifications";
import { QUERY_KEYS } from "@/lib/constants/queryKeys";
import type { NotificationListParams } from "@/types/notification";

interface UseNotificationsOptions extends NotificationListParams {
  enabled?: boolean;
}

/** GET /notifications */
export function useNotifications(options: UseNotificationsOptions = {}) {
  const page = options.page ?? 1;
  const limit = options.limit ?? NOTIFICATION_PAGE_SIZE;
  const enabled = options.enabled ?? true;

  return useApiQuery({
    queryKey: QUERY_KEYS.NOTIFICATIONS.LIST(page, limit),
    queryFn: () => getNotifications({ page, limit }),
    enabled,
    placeholderData: keepPreviousData,
  });
}
