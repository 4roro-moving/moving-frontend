"use client";

import { useQueryClient } from "@tanstack/react-query";

import { useApiMutation } from "@/hooks/queries/useApiMutation";
import { useAuthQueryScope } from "@/hooks/useAuthQueryScope";
import { readAllNotifications } from "@/lib/api/notifications";
import { QUERY_KEYS } from "@/lib/constants/queryKeys";
import type {
  NotificationListResponse,
  ReadAllNotificationsResponse,
  UnreadNotificationCountResponse,
} from "@/types/notification";

interface ReadAllNotificationsContext {
  previousLists: Array<[readonly unknown[], NotificationListResponse | undefined]>;
  previousUnreadCount: UnreadNotificationCountResponse | undefined;
}

/** PATCH /notifications/read-all — 미읽음 알림 전체 읽음 처리 */
export function useReadAllNotifications() {
  const queryClient = useQueryClient();
  const { authScope } = useAuthQueryScope();
  const listScopeQueryKey = QUERY_KEYS.NOTIFICATIONS.LIST_SCOPE(authScope);
  const unreadCountQueryKey = QUERY_KEYS.NOTIFICATIONS.UNREAD_COUNT(authScope);

  return useApiMutation<ReadAllNotificationsResponse, void, ReadAllNotificationsContext>({
    mutationFn: () => readAllNotifications(),
    onMutate: async () => {
      await Promise.all([
        queryClient.cancelQueries({ queryKey: listScopeQueryKey }),
        queryClient.cancelQueries({ queryKey: unreadCountQueryKey }),
      ]);

      const previousLists = queryClient.getQueriesData<NotificationListResponse>({
        queryKey: listScopeQueryKey,
      });
      const previousUnreadCount =
        queryClient.getQueryData<UnreadNotificationCountResponse>(unreadCountQueryKey);

      const readAt = new Date().toISOString();

      queryClient.setQueriesData<NotificationListResponse>(
        { queryKey: listScopeQueryKey },
        (current) => {
          if (!current) {
            return current;
          }

          return {
            ...current,
            notifications: current.notifications.map((notification) =>
              notification.isRead
                ? notification
                : {
                    ...notification,
                    isRead: true,
                    readAt,
                  },
            ),
          };
        },
      );

      queryClient.setQueryData<UnreadNotificationCountResponse>(unreadCountQueryKey, {
        unreadCount: 0,
      });

      return { previousLists, previousUnreadCount };
    },
    onError: (_error, _variables, context) => {
      if (!context) {
        return;
      }

      for (const [queryKey, previous] of context.previousLists) {
        queryClient.setQueryData(queryKey, previous);
      }

      queryClient.setQueryData(unreadCountQueryKey, context.previousUnreadCount);
    },
    onSettled: async () => {
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: listScopeQueryKey }),
        queryClient.invalidateQueries({ queryKey: unreadCountQueryKey }),
      ]);
    },
  });
}
