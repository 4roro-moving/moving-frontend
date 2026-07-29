export type NotificationType =
  | "ESTIMATE_REQUEST_RECEIVED"
  | "DESIGNATED_REQUEST_RECEIVED"
  | "ESTIMATE_RECEIVED"
  | "ESTIMATE_CONFIRMED"
  | "ESTIMATE_REQUEST_REJECTED"
  | "MOVE_DAY_REMINDER"
  | "ESTIMATE_EXPIRATION_REMINDER"
  | "REVIEW_AVAILABLE"
  | "REVIEW_RECEIVED"
  | "CHAT_MESSAGE_RECEIVED"
  | "ESTIMATE_REVISION_REQUESTED"
  | "ESTIMATE_REVISION_APPROVED"
  | "ESTIMATE_REVISION_REJECTED";

export interface NotificationItem {
  id: number;
  type: NotificationType;
  title: string;
  /** 타입별 고정 문구에 삽입되는 가변 강조 문구 */
  content: string;
  linkUrl?: string | null;
  isRead: boolean;
  createdAtLabel: string;
}
