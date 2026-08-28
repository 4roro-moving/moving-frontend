export const GIVEAWAY_NOTIFICATION_TYPE = {
  REQUEST_RECEIVED: "GIVEAWAY_REQUEST_RECEIVED",
  REQUEST_SELECTED: "GIVEAWAY_REQUEST_SELECTED",
  REQUEST_REJECTED: "GIVEAWAY_REQUEST_REJECTED",
  REQUEST_CANCELED: "GIVEAWAY_REQUEST_CANCELED",
  COMPLETED: "GIVEAWAY_COMPLETED",
} as const;

export const GIVEAWAY_NOTIFICATION_TYPES = [
  GIVEAWAY_NOTIFICATION_TYPE.REQUEST_RECEIVED,
  GIVEAWAY_NOTIFICATION_TYPE.REQUEST_SELECTED,
  GIVEAWAY_NOTIFICATION_TYPE.REQUEST_REJECTED,
  GIVEAWAY_NOTIFICATION_TYPE.REQUEST_CANCELED,
  GIVEAWAY_NOTIFICATION_TYPE.COMPLETED,
] as const;

export type GiveawayNotificationType =
  (typeof GIVEAWAY_NOTIFICATION_TYPE)[keyof typeof GIVEAWAY_NOTIFICATION_TYPE];

export const isGiveawayNotificationType = (
  type: string | undefined,
): type is GiveawayNotificationType =>
  GIVEAWAY_NOTIFICATION_TYPES.some((giveawayType) => giveawayType === type);

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
  | "CONTENT_RESTORED"
  | "ESTIMATE_CANCELED_BY_ADMIN"
  | "ESTIMATE_CANCELED_BY_ACCOUNT_SUSPENSION"
  | "ESTIMATE_REQUEST_CANCELED_BY_ACCOUNT_SUSPENSION"
  | GiveawayNotificationType;

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
