"use client";

import { useQueryClient } from "@tanstack/react-query";

import { useApiMutation } from "@/hooks/queries/useApiMutation";
import { useAuthQueryScope } from "@/hooks/useAuthQueryScope";
import { readNotification } from "@/lib/api/notifications";
import { QUERY_KEYS } from "@/lib/constants/queryKeys";
import type {
  NotificationItem,
  NotificationListResponse,
  ReadNotificationResponse,
  UnreadNotificationCountResponse,
} from "@/types/notification";

interface ReadNotificationContext {
  previousByQuery: Array<{
    queryKey: readonly unknown[];
    previousNotification: NotificationItem | null;
  }>;
  unreadDecremented: boolean;
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
  const { authScope } = useAuthQueryScope();
  const unreadCountQueryKey = QUERY_KEYS.NOTIFICATIONS.UNREAD_COUNT(authScope);

  return useApiMutation<ReadNotificationResponse, number, ReadNotificationContext>({
    mutationFn: (notificationId) => readNotification(notificationId),
    onMutate: async (notificationId) => {
      await Promise.all([
        queryClient.cancelQueries({ queryKey: QUERY_KEYS.NOTIFICATIONS.LIST_ROOT }),
        queryClient.cancelQueries({ queryKey: QUERY_KEYS.NOTIFICATIONS.UNREAD_COUNT_ROOT }),
      ]);

      const previousLists = queryClient.getQueriesData<NotificationListResponse>({
        queryKey: QUERY_KEYS.NOTIFICATIONS.LIST_ROOT,
      });
      const previousByQuery = previousLists.map(([queryKey, current]) => ({
        queryKey,
        previousNotification:
          current?.notifications.find((notification) => notification.id === notificationId) ?? null,
      }));

      const wasUnread = previousLists.some(([, current]) =>
        current?.notifications.some(
          (notification) => notification.id === notificationId && !notification.isRead,
        ),
      );

      if (!wasUnread) {
        return { previousByQuery, unreadDecremented: false };
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

      queryClient.setQueryData<UnreadNotificationCountResponse>(unreadCountQueryKey, (current) => {
        if (!current) {
          return current;
        }

        return {
          unreadCount: Math.max(0, current.unreadCount - 1),
        };
      });

      return { previousByQuery, unreadDecremented: true };
    },
    onError: (_error, _notificationId, context) => {
      if (!context) {
        return;
      }

      for (const { queryKey, previousNotification } of context.previousByQuery) {
        if (!previousNotification) continue;

        queryClient.setQueryData<NotificationListResponse | undefined>(queryKey, (current) => {
          if (!current) {
            return current;
          }

          return {
            ...current,
            notifications: current.notifications.map((notification) =>
              notification.id === previousNotification.id ? previousNotification : notification,
            ),
          };
        });
      }

      if (context.unreadDecremented) {
        queryClient.setQueryData<UnreadNotificationCountResponse>(
          unreadCountQueryKey,
          (current) => {
            if (!current) {
              return current;
            }

            return {
              unreadCount: current.unreadCount + 1,
            };
          },
        );
      }
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
        queryClient.invalidateQueries({ queryKey: QUERY_KEYS.NOTIFICATIONS.UNREAD_COUNT_ROOT }),
      ]);
    },
  });
}
