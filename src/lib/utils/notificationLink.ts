import { APP_ROUTES } from "@/lib/constants/appRoutes";
import { parsePositiveIntId } from "@/lib/utils/parsePositiveIntId";

const GIVEAWAY_API_DETAIL_PATH = /^\/giveaways\/(\d+)$/;

/** 백엔드 알림 linkUrl에서 나눔 글 ID를 추출합니다. */
export const parseGiveawayIdFromNotificationLinkUrl = (
  linkUrl: string | null | undefined,
): number | null => {
  if (!linkUrl) {
    return null;
  }

  const match = GIVEAWAY_API_DETAIL_PATH.exec(linkUrl);
  return match?.[1] === undefined ? null : parsePositiveIntId(match[1]);
};

/** 백엔드 알림 linkUrl을 프론트 페이지 경로로 변환합니다. */
export const toNotificationHref = (linkUrl: string): string => {
  const match = GIVEAWAY_API_DETAIL_PATH.exec(linkUrl);
  const giveawayId = match?.[1] === undefined ? null : parsePositiveIntId(match[1]);

  if (giveawayId !== null) {
    return APP_ROUTES.COMMUNITY.GIVEAWAY_DETAIL(giveawayId);
  }

  return linkUrl;
};
