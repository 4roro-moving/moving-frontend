export type NotificationMessagePart = {
  text: string;
  highlight?: boolean;
};

export type NotificationMockItem = {
  id: string;
  parts: NotificationMessagePart[];
  createdAtLabel: string;
};

export const NOTIFICATION_PAGE_SIZE = 5;

/**
 * GNB 알림 패널 mock (Figma gnb/notification-list)
 * API 연동 전 임시 데이터입니다.
 */
export const MOCK_NOTIFICATIONS: NotificationMockItem[] = [
  {
    id: "notification-1",
    parts: [
      { text: "김코드 기사님의 " },
      { text: "소형이사 견적", highlight: true },
      { text: "이 도착했어요" },
    ],
    createdAtLabel: "2시간 전",
  },
  {
    id: "notification-2",
    parts: [
      { text: "김코드 기사님의 견적이 " },
      { text: "확정", highlight: true },
      { text: "되었어요" },
    ],
    createdAtLabel: "3시간 전",
  },
  {
    id: "notification-3",
    parts: [
      { text: "내일은 " },
      { text: "경기(일산) → 서울(영등포) 이사 예정일", highlight: true },
      { text: "이에요." },
    ],
    createdAtLabel: "5시간 전",
  },
  {
    id: "notification-4",
    parts: [
      { text: "이무빙 기사님의 " },
      { text: "가정이사 견적", highlight: true },
      { text: "이 도착했어요" },
    ],
    createdAtLabel: "1일 전",
  },
  {
    id: "notification-5",
    parts: [{ text: "박이사 기사님을 " }, { text: "찜", highlight: true }, { text: "했습니다" }],
    createdAtLabel: "1일 전",
  },
  {
    id: "notification-6",
    parts: [{ text: "작성 가능한 " }, { text: "리뷰", highlight: true }, { text: "가 있어요" }],
    createdAtLabel: "2일 전",
  },
];
