import { parsePositiveIntId } from "@/lib/utils/parsePositiveIntId";

/** 알림 linkUrl(`/community/giveaway/:id`)에서 나눔 글 ID를 추출합니다. */
const GIVEAWAY_PAGE_DETAIL_PATH = /^\/community\/giveaway\/(\d+)$/;

/** 백엔드 알림 linkUrl에서 나눔 글 ID를 추출합니다. */
export const parseGiveawayIdFromNotificationLinkUrl = (
  linkUrl: string | null | undefined,
): number | null => {
  if (!linkUrl) {
    return null;
  }

  const match = GIVEAWAY_PAGE_DETAIL_PATH.exec(linkUrl);
  return match?.[1] === undefined ? null : parsePositiveIntId(match[1]);
};
