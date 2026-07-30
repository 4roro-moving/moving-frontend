"use client";

import { useQueryClient } from "@tanstack/react-query";

import { useApiMutation } from "@/hooks/queries/useApiMutation";
import { readNotification } from "@/lib/api/notifications";
import { QUERY_KEYS } from "@/lib/constants/queryKeys";
import type {
  NotificationItem,
  NotificationListResponse,
  ReadNotificationResponse,
  UnreadNotificationCountResponse,
} from "@/types/notification";

interface ReadNotificationContext {
  previousLists: [readonly unknown[], NotificationListResponse | undefined][];
  previousUnread: UnreadNotificationCountResponse | undefined;
}

function markNotificationAsRead(notification: NotificationItem, readAt: string): NotificationItem {
  if (notification.isRead) {
    return notification;
  }

  return {
    ...notification,
    isRead: true,
    readAt,
  };
}

/** PATCH /notifications/:notificationId/read — isRead가 false일 때만 호출 */
export function useReadNotification() {
  const queryClient = useQueryClient();

  return useApiMutation<ReadNotificationResponse, number, ReadNotificationContext>({
    mutationFn: (notificationId) => readNotification(notificationId),
    onMutate: async (notificationId) => {
      await Promise.all([
        queryClient.cancelQueries({ queryKey: QUERY_KEYS.NOTIFICATIONS.LIST_ROOT }),
        queryClient.cancelQueries({ queryKey: QUERY_KEYS.NOTIFICATIONS.UNREAD_COUNT }),
      ]);

      const previousLists = queryClient.getQueriesData<NotificationListResponse>({
        queryKey: QUERY_KEYS.NOTIFICATIONS.LIST_ROOT,
      });
      const previousUnread = queryClient.getQueryData<UnreadNotificationCountResponse>(
        QUERY_KEYS.NOTIFICATIONS.UNREAD_COUNT,
      );

      const wasUnread = previousLists.some(([, current]) =>
        current?.notifications.some(
          (notification) => notification.id === notificationId && !notification.isRead,
        ),
      );

      if (!wasUnread) {
        return { previousLists, previousUnread };
      }

      const readAt = new Date().toISOString();

      queryClient.setQueriesData<NotificationListResponse>(
        { queryKey: QUERY_KEYS.NOTIFICATIONS.LIST_ROOT },
        (current) => {
          if (!current) {
            return current;
          }

          return {
            ...current,
            notifications: current.notifications.map((notification) =>
              notification.id === notificationId
                ? markNotificationAsRead(notification, readAt)
                : notification,
            ),
          };
        },
      );

      queryClient.setQueryData<UnreadNotificationCountResponse>(
        QUERY_KEYS.NOTIFICATIONS.UNREAD_COUNT,
        (current) => {
          if (!current) {
            return current;
          }

          return {
            unreadCount: Math.max(0, current.unreadCount - 1),
          };
        },
      );

      return { previousLists, previousUnread };
    },
    onError: (_error, _notificationId, context) => {
      if (!context) {
        return;
      }

      for (const [queryKey, data] of context.previousLists) {
        queryClient.setQueryData(queryKey, data);
      }

      queryClient.setQueryData(QUERY_KEYS.NOTIFICATIONS.UNREAD_COUNT, context.previousUnread);
    },
    onSuccess: (data) => {
      const updated = data.notification;

      queryClient.setQueriesData<NotificationListResponse>(
        { queryKey: QUERY_KEYS.NOTIFICATIONS.LIST_ROOT },
        (current) => {
          if (!current) {
            return current;
          }

          return {
            ...current,
            notifications: current.notifications.map((notification) =>
              notification.id === updated.id ? updated : notification,
            ),
          };
        },
      );
    },
    onSettled: async () => {
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: QUERY_KEYS.NOTIFICATIONS.LIST_ROOT }),
        queryClient.invalidateQueries({ queryKey: QUERY_KEYS.NOTIFICATIONS.UNREAD_COUNT }),
      ]);
    },
  });
}
