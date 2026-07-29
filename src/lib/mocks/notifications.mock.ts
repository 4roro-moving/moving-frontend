import type { NotificationItem } from "@/types/notification";

export type { NotificationItem, NotificationType } from "@/types/notification";

export const NOTIFICATION_PAGE_SIZE = 5;

/**
 * GNB 알림 패널 mock (Figma gnb/notification-list)
 * API 연동 전 임시 데이터입니다.
 * `content`는 타입별 고정 문구에 삽입되는 가변(주황 강조) 값입니다.
 */
export const MOCK_NOTIFICATIONS: NotificationItem[] = [
  {
    id: 1,
    type: "ESTIMATE_RECEIVED",
    title: "견적 도착",
    content: "김코드 기사님의 소형이사 견적",
    linkUrl: "/estimates/pending",
    isRead: false,
    createdAtLabel: "2시간 전",
  },
  {
    id: 2,
    type: "ESTIMATE_CONFIRMED",
    title: "견적 확정",
    content: "김코드 기사님의 견적이 확정",
    linkUrl: "/estimates",
    isRead: true,
    createdAtLabel: "3시간 전",
  },
  {
    id: 3,
    type: "MOVE_DAY_REMINDER",
    title: "이사 당일 안내",
    content: "경기(일산) → 서울(영등포) 이사 예정일",
    linkUrl: null,
    isRead: false,
    createdAtLabel: "5시간 전",
  },
  {
    id: 4,
    type: "ESTIMATE_RECEIVED",
    title: "견적 도착",
    content: "이무빙 기사님의 가정이사 견적",
    linkUrl: "/estimates/pending",
    isRead: true,
    createdAtLabel: "1일 전",
  },
  {
    id: 5,
    type: "CHAT_MESSAGE_RECEIVED",
    title: "채팅 메시지",
    content: "박이사 기사님",
    linkUrl: null,
    isRead: false,
    createdAtLabel: "1일 전",
  },
  {
    id: 6,
    type: "REVIEW_AVAILABLE",
    title: "리뷰 작성 안내",
    content: "리뷰",
    linkUrl: "/reviews",
    isRead: true,
    createdAtLabel: "2일 전",
  },
];

export const getUnreadNotificationCount = (
  notifications: NotificationItem[] = MOCK_NOTIFICATIONS,
): number => notifications.filter((notification) => !notification.isRead).length;
