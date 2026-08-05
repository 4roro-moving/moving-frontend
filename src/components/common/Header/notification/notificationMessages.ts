import type { NotificationType } from "@/types/notification";

export interface NotificationMessageTemplate {
  prefix: string;
  suffix: string;
}

/**
 * 알림 타입별 고정 문구.
 * 가운데 `content`(가변·주황 강조)가 삽입됩니다.
 */
export const NOTIFICATION_MESSAGE_TEMPLATES: Record<NotificationType, NotificationMessageTemplate> =
  {
    ESTIMATE_REQUEST_RECEIVED: {
      prefix: "",
      suffix: " 견적 요청이 도착했어요",
    },
    DESIGNATED_REQUEST_RECEIVED: {
      prefix: "나를 지정한 ",
      suffix: " 견적 요청이 도착했어요",
    },
    ESTIMATE_RECEIVED: {
      prefix: "",
      suffix: "이 도착했어요",
    },
    ESTIMATE_CONFIRMED: {
      prefix: "",
      suffix: "견적이 확정 되었어요",
    },
    ESTIMATE_REQUEST_REJECTED: {
      prefix: "",
      suffix: " 님이 견적 요청을 반려했어요",
    },
    ESTIMATE_REQUEST_CANCELED: {
      prefix: "",
      suffix: " 님이 견적 요청을 취소했어요",
    },
    MOVE_DAY_REMINDER: {
      prefix: "내일은 ",
      suffix: "이에요.",
    },
    ESTIMATE_EXPIRATION_REMINDER: {
      prefix: "",
      suffix: " 견적 요청이 곧 만료돼요",
    },
    REVIEW_AVAILABLE: {
      prefix: "작성 가능한 ",
      suffix: "가 있어요",
    },
    REVIEW_RECEIVED: {
      prefix: "",
      suffix: " 리뷰를 남겼어요",
    },
    CHAT_MESSAGE_RECEIVED: {
      prefix: "",
      suffix: " 새 메시지가 도착했어요",
    },
    ESTIMATE_REVISION_REQUESTED: {
      prefix: "",
      suffix: " 견적 수정 요청이 도착했어요",
    },
    ESTIMATE_REVISION_APPROVED: {
      prefix: "",
      suffix: " 견적 수정 요청이 승인되었어요",
    },
    ESTIMATE_REVISION_REJECTED: {
      prefix: "",
      suffix: " 견적 수정 요청이 거절되었어요",
    },
    NOTICE_RECEIVED: {
      prefix: "",
      suffix: "",
    },
    INQUIRY_ANSWERED: {
      prefix: "",
      suffix: " 문의에 답변이 등록되었어요",
    },
    CONTENT_HIDDEN: {
      prefix: "",
      suffix: "에 대한 리뷰가 숨김처리 되었습니다.",
    },
    CONTENT_RESTORED: {
      prefix: "",
      suffix: "에 대한 리뷰가 복구되었습니다.",
    },
  };

export interface NotificationMessagePart {
  text: string;
  highlight?: boolean;
}

export const buildNotificationMessageParts = (
  type: NotificationType,
  content: string,
): NotificationMessagePart[] => {
  const template = NOTIFICATION_MESSAGE_TEMPLATES[type];

  // 백엔드에만 있는 신규 타입이 와도 패널이 깨지지 않도록 폴백
  if (!template) {
    return content ? [{ text: content, highlight: true }] : [{ text: "새로운 알림이 있어요" }];
  }

  const { prefix, suffix } = template;
  const parts: NotificationMessagePart[] = [];

  if (prefix) {
    parts.push({ text: prefix });
  }

  if (content) {
    parts.push({ text: content, highlight: true });
  }

  if (suffix) {
    parts.push({ text: suffix });
  }

  return parts;
};
