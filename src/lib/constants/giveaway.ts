import { GIVEAWAY_LIST_SORT, GIVEAWAY_STATUS } from "@/types/giveaway";
import type { GiveawayListSort, GiveawayStatus } from "@/types/giveaway";

export const GIVEAWAY_PAGE_LIMIT = 10;

/** 데스크톱 첫 행(4열)까지 썸네일을 preload해 LCP를 당긴다 */
export const GIVEAWAY_ABOVE_THE_FOLD_THUMBNAIL_COUNT = 4;

export const GIVEAWAY_KEYWORD_MAX_LENGTH = 100;

export const GIVEAWAY_LIST_STALE_TIME_MS = 60 * 1000;

export const GIVEAWAY_ALL_VALUE = "all" as const;

export const GIVEAWAY_WRITE_BUTTON_LABEL = "나눔 글 작성";

export const GIVEAWAY_TITLE_MIN_LENGTH = 1;
export const GIVEAWAY_TITLE_MAX_LENGTH = 100;
export const GIVEAWAY_DESCRIPTION_MIN_LENGTH = 1;
export const GIVEAWAY_DESCRIPTION_MAX_LENGTH = 2000;

export const GIVEAWAY_IMAGE_MAX_COUNT = 5;
export const GIVEAWAY_IMAGE_MAX_SIZE_BYTES = 5 * 1024 * 1024;
export const GIVEAWAY_IMAGE_MAX_TOTAL_SIZE_BYTES = 50 * 1024 * 1024;
export const GIVEAWAY_IMAGE_MAX_SIZE_MB = GIVEAWAY_IMAGE_MAX_SIZE_BYTES / (1024 * 1024);
export const GIVEAWAY_IMAGE_MAX_TOTAL_SIZE_MB = GIVEAWAY_IMAGE_MAX_TOTAL_SIZE_BYTES / (1024 * 1024);

export const GIVEAWAY_CREATE_COVER_LABEL = "대표사진";

export const GIVEAWAY_EMPTY_DESCRIPTION_LINES = [
  "아직 나눔 글이 없어요.",
  "첫 나눔 글을 작성해 보세요.",
] as const;

export const GIVEAWAY_SORT_OPTIONS = [
  { value: GIVEAWAY_LIST_SORT.LATEST, label: "최신 순" },
  { value: GIVEAWAY_LIST_SORT.OLDEST, label: "오래된 순" },
] as const satisfies readonly {
  value: GiveawayListSort;
  label: string;
}[];

export const GIVEAWAY_STATUS_FILTER_OPTIONS = [
  { value: GIVEAWAY_ALL_VALUE, label: "전체" },
  { value: GIVEAWAY_STATUS.AVAILABLE, label: "나눔 가능" },
  { value: GIVEAWAY_STATUS.IN_PROGRESS, label: "진행 중" },
  { value: GIVEAWAY_STATUS.COMPLETED, label: "완료" },
] as const satisfies readonly { value: string; label: string }[];

export const GIVEAWAY_THUMBNAIL_OVERLAY_LABEL = {
  [GIVEAWAY_STATUS.IN_PROGRESS]: "진행 중",
  [GIVEAWAY_STATUS.COMPLETED]: "나눔 완료",
} as const satisfies Partial<Record<GiveawayStatus, string>>;

export const getGiveawayThumbnailOverlayLabel = (status: GiveawayStatus): string | null => {
  if (status === GIVEAWAY_STATUS.IN_PROGRESS) {
    return GIVEAWAY_THUMBNAIL_OVERLAY_LABEL[GIVEAWAY_STATUS.IN_PROGRESS];
  }

  if (status === GIVEAWAY_STATUS.COMPLETED) {
    return GIVEAWAY_THUMBNAIL_OVERLAY_LABEL[GIVEAWAY_STATUS.COMPLETED];
  }

  return null;
};
