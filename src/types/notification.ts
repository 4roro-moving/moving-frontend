/** 알림 패널 문구 템플릿이 정의된 타입 (notificationMessages.ts 기준) */
export type NotificationType =
  | "ESTIMATE_REQUEST_RECEIVED"
  | "DESIGNATED_REQUEST_RECEIVED"
  | "ESTIMATE_RECEIVED"
  | "ESTIMATE_CONFIRMED"
  | "ESTIMATE_REQUEST_REJECTED"
  | "ESTIMATE_REQUEST_CANCELED"
  | "REVIEW_RECEIVED"
  | "CHAT_MESSAGE_RECEIVED"
  | "NOTICE_RECEIVED"
  | "INQUIRY_ANSWERED"
  | "CONTENT_HIDDEN"
  | "CONTENT_RESTORED";

/** 백엔드 알림 목록·상세 공통 아이템 */
export interface NotificationItem {
  id: number;
  type: NotificationType;
  title: string;
  /** 타입별 고정 문구에 삽입되는 가변 강조 문구 */
  content: string;
  linkUrl: string | null;
  isRead: boolean;
  readAt: string | null;
  expiresAt: string | null;
  createdAt: string;
}

export interface NotificationPagination {
  page: number;
  limit: number;
  totalCount: number;
  totalPages: number;
  hasNextPage: boolean;
}

export interface NotificationListResponse {
  notifications: NotificationItem[];
  pagination: NotificationPagination;
}

export interface UnreadNotificationCountResponse {
  unreadCount: number;
}

export interface ReadNotificationResponse {
  notification: NotificationItem;
}

export interface ReadAllNotificationsResponse {
  updatedCount: number;
}

export interface NotificationListParams {
  page?: number;
  limit?: number;
}
