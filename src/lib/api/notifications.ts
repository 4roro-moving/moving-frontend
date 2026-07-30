import fetchInstance from "@/lib/api/fetchInstance";
import { API_ROUTES } from "@/lib/constants/apiRoutes";
import type {
  NotificationListParams,
  NotificationListResponse,
  ReadAllNotificationsResponse,
  ReadNotificationResponse,
  UnreadNotificationCountResponse,
} from "@/types/notification";

export const NOTIFICATION_PAGE_SIZE = 5;

function buildNotificationListQuery(params: NotificationListParams = {}): string {
  const searchParams = new URLSearchParams();
  const page = params.page ?? 1;
  const limit = params.limit ?? NOTIFICATION_PAGE_SIZE;

  searchParams.set("page", String(page));
  searchParams.set("limit", String(limit));

  return `${API_ROUTES.NOTIFICATIONS.ROOT}?${searchParams.toString()}`;
}

/** GET /notifications — 알림 목록 (페이지네이션은 data 내부에 포함) */
export async function getNotifications(
  params: NotificationListParams = {},
): Promise<NotificationListResponse> {
  return fetchInstance.get<NotificationListResponse>(buildNotificationListQuery(params));
}

/** GET /notifications/unread-count */
export async function getUnreadNotificationCount(): Promise<UnreadNotificationCountResponse> {
  return fetchInstance.get<UnreadNotificationCountResponse>(API_ROUTES.NOTIFICATIONS.UNREAD_COUNT);
}

/** PATCH /notifications/:notificationId/read */
export async function readNotification(notificationId: number): Promise<ReadNotificationResponse> {
  return fetchInstance.patch<ReadNotificationResponse>(
    API_ROUTES.NOTIFICATIONS.READ(notificationId),
  );
}

/** PATCH /notifications/read-all */
export async function readAllNotifications(): Promise<ReadAllNotificationsResponse> {
  return fetchInstance.patch<ReadAllNotificationsResponse>(API_ROUTES.NOTIFICATIONS.READ_ALL);
}
