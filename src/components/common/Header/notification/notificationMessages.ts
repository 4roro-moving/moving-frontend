import {
  GIVEAWAY_NOTIFICATION_TYPE,
  isGiveawayNotificationType,
  type NotificationType,
} from "@/types/notification";

type NotificationMessageKey =
  | "estimateRequestReceived"
  | "designatedRequestPrefix"
  | "estimateReceived"
  | "estimateConfirmed"
  | "estimateRequestRejected"
  | "estimateRequestCanceled"
  | "reviewReceived"
  | "chatMessageReceived"
  | "inquiryAnswered"
  | "contentHidden"
  | "contentRestored"
  | "adminCanceledPrefix"
  | "moverSuspendedPrefix"
  | "customerSuspendedPrefix"
  | "canceledSuffix"
  | "fallback";

export interface NotificationMessageTemplate {
  prefixKey?: NotificationMessageKey;
  suffixKey?: NotificationMessageKey;
}

/**
 * 알림 타입별 고정 문구.
 * 가운데 `content`(가변·주황 강조)가 삽입됩니다.
 */
export const NOTIFICATION_MESSAGE_TEMPLATES: Record<NotificationType, NotificationMessageTemplate> =
  {
    //고객이 견적 요청을 올린 경우 관련 기사에게 알림 문구
    ESTIMATE_REQUEST_RECEIVED: {
      suffixKey: "estimateRequestReceived",
    },
    //고객이 지정 견적 요청한 경우 기사에게 알림 문구
    DESIGNATED_REQUEST_RECEIVED: {
      prefixKey: "designatedRequestPrefix",
      suffixKey: "estimateRequestReceived",
    },
    //기사가 견적을 보낸 경우 알림 문구
    ESTIMATE_RECEIVED: {
      suffixKey: "estimateReceived",
    },
    //고객이 견적을 확정한 경우 알림 문구
    ESTIMATE_CONFIRMED: {
      suffixKey: "estimateConfirmed",
    },
    //기사가 견적 요청을 반려했을 때 알림 문구
    ESTIMATE_REQUEST_REJECTED: {
      suffixKey: "estimateRequestRejected",
    },
    //고객이 견적 요청을 취소했을 때 알림 문구
    ESTIMATE_REQUEST_CANCELED: {
      suffixKey: "estimateRequestCanceled",
    },
    //고객이 리뷰를 남긴 경우 기사에게 알림 문구
    REVIEW_RECEIVED: {
      suffixKey: "reviewReceived",
    },
    //메세지 도착 알림 post 아직 없음
    CHAT_MESSAGE_RECEIVED: {
      suffixKey: "chatMessageReceived",
    },
    //공지사항 추가 알림 문구
    NOTICE_RECEIVED: {},
    //문의 답변 등록 알림 문구
    INQUIRY_ANSWERED: {
      // content(과거 완성 문장 포함)는 무시하고 locale 완성 문장만 사용
      suffixKey: "inquiryAnswered",
    },
    //관리자가 콘텐츠(리뷰/거주후기/나눔) 숨김 처리한 경우 알림 문구
    // content에 받침 유무가 달라 "가/이" 조사를 suffix에 두지 않음
    CONTENT_HIDDEN: {
      suffixKey: "contentHidden",
    },
    //관리자가 콘텐츠(리뷰/거주후기/나눔) 복구 처리한 경우 알림 문구
    CONTENT_RESTORED: {
      suffixKey: "contentRestored",
    },
    // 관리자가 확정 견적 거래를 취소한 경우 고객/기사에게 알림 문구
    ESTIMATE_CANCELED_BY_ADMIN: {
      prefixKey: "adminCanceledPrefix",
      suffixKey: "canceledSuffix",
    },
    // 기사의 정지로 고객의 견적 요청이 취소된 경우, 고객에게 알림 문구
    ESTIMATE_CANCELED_BY_ACCOUNT_SUSPENSION: {
      prefixKey: "moverSuspendedPrefix",
      suffixKey: "canceledSuffix",
    },
    // 고객의 정지로 견적 요청이 취소된 경우, 견적을 보낸 기사와 지정 견적 대상 기사에게 알림 문구
    ESTIMATE_REQUEST_CANCELED_BY_ACCOUNT_SUSPENSION: {
      prefixKey: "customerSuspendedPrefix",
      suffixKey: "canceledSuffix",
    },
    // 작성자에게 새 나눔 신청이 도착한 경우 알림 문구 (content가 완성 문장)
    [GIVEAWAY_NOTIFICATION_TYPE.REQUEST_RECEIVED]: {},
    // 신청자가 수령자로 선정된 경우 알림 문구
    [GIVEAWAY_NOTIFICATION_TYPE.REQUEST_SELECTED]: {},
    // 신청자의 나눔 신청이 거절된 경우 알림 문구
    [GIVEAWAY_NOTIFICATION_TYPE.REQUEST_REJECTED]: {},
    // 작성자에게 신청 취소(대기/선정)가 도착한 경우 알림 문구
    [GIVEAWAY_NOTIFICATION_TYPE.REQUEST_CANCELED]: {},
    // 수령자에게 나눔 완료가 안내되는 경우 알림 문구
    [GIVEAWAY_NOTIFICATION_TYPE.COMPLETED]: {},
  };

export interface NotificationMessagePart {
  text: string;
  highlight?: boolean;
}

const GIVEAWAY_TITLE_PATTERN = /^(「.+?」)(.*)$/;

const buildGiveawayNotificationMessageParts = (
  content: string,
): NotificationMessagePart[] | null => {
  const match = GIVEAWAY_TITLE_PATTERN.exec(content);
  if (!match?.[1]) {
    return null;
  }

  const rest = match[2];
  if (rest) {
    return [{ text: match[1], highlight: true }, { text: rest }];
  }

  return [{ text: match[1], highlight: true }];
};

export const buildNotificationMessageParts = (
  type: NotificationType,
  content: string,
  translate: (key: NotificationMessageKey) => string,
): NotificationMessagePart[] => {
  const template = NOTIFICATION_MESSAGE_TEMPLATES[type];

  // 백엔드에만 있는 신규 타입이 와도 패널이 깨지지 않도록 폴백
  if (!template) {
    return content ? [{ text: content, highlight: true }] : [{ text: translate("fallback") }];
  }

  if (isGiveawayNotificationType(type)) {
    const giveawayParts = buildGiveawayNotificationMessageParts(content);
    if (giveawayParts) {
      return giveawayParts;
    }
  }

  // BE가 완성 문장을 content에 넣던 타입 — locale 문장만 사용해 중복·한국어 고정을 피한다.
  if (type === "INQUIRY_ANSWERED") {
    return [{ text: translate("inquiryAnswered") }];
  }

  const prefix = template.prefixKey ? translate(template.prefixKey) : "";
  const suffix = template.suffixKey ? translate(template.suffixKey) : "";
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
