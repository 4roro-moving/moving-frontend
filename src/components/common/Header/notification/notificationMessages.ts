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
    //고객이 견적 요청을 올린 경우 관련 기사에게 알림 문구
    ESTIMATE_REQUEST_RECEIVED: {
      prefix: "",
      suffix: " 견적 요청이 도착했어요",
    },
    //고객이 지정 견적 요청한 경우 기사에게 알림 문구
    DESIGNATED_REQUEST_RECEIVED: {
      prefix: "나를 지정한 ",
      suffix: " 견적 요청이 도착했어요",
    },
    //기사가 견적을 보낸 경우 알림 문구
    ESTIMATE_RECEIVED: {
      prefix: "",
      suffix: "이 도착했어요",
    },
    //고객이 견적을 확정한 경우 알림 문구
    ESTIMATE_CONFIRMED: {
      prefix: "",
      suffix: "견적이 확정 되었어요",
    },
    //기사가 견적 요청을 반려했을 때 알림 문구
    ESTIMATE_REQUEST_REJECTED: {
      prefix: "",
      suffix: " 님이 견적 요청을 반려했어요",
    },
    //고객이 견적 요청을 취소했을 때 알림 문구
    ESTIMATE_REQUEST_CANCELED: {
      prefix: "",
      suffix: " 님이 견적 요청을 취소했어요",
    },
    //고객이 리뷰를 남긴 경우 기사에게 알림 문구
    REVIEW_RECEIVED: {
      prefix: "",
      suffix: " 리뷰를 남겼어요",
    },
    //메세지 도착 알림 post 아직 없음
    CHAT_MESSAGE_RECEIVED: {
      prefix: "",
      suffix: "님으로부터 메시지가 도착했습니다.",
    },
    //공지사항 추가 알림 문구
    NOTICE_RECEIVED: {
      prefix: "",
      suffix: "",
    },
    //문의 답변 등록 알림 문구
    INQUIRY_ANSWERED: {
      prefix: "",
      suffix: " 문의에 답변이 등록되었어요",
    },
    //관리자가 콘텐츠(리뷰/거주후기/나눔) 숨김 처리한 경우 알림 문구
    // content에 받침 유무가 달라 "가/이" 조사를 suffix에 두지 않음
    CONTENT_HIDDEN: {
      prefix: "",
      suffix: " 숨김처리 되었습니다.",
    },
    //관리자가 콘텐츠(리뷰/거주후기/나눔) 복구 처리한 경우 알림 문구
    CONTENT_RESTORED: {
      prefix: "",
      suffix: " 복구처리 되었습니다.",
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
