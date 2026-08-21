import {
  GIVEAWAY_LIST_SORT,
  GIVEAWAY_REQUEST_STATUS,
  GIVEAWAY_STATUS,
  type GiveawayListSort,
  type GiveawayRequestStatus,
  type GiveawayStatus,
  type MyGiveawayRequestItem,
} from "@/types/giveaway";

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
export const GIVEAWAY_IMAGE_MAX_TOTAL_SIZE_BYTES = 25 * 1024 * 1024;
export const GIVEAWAY_IMAGE_MAX_SIZE_MB = GIVEAWAY_IMAGE_MAX_SIZE_BYTES / (1024 * 1024);
export const GIVEAWAY_IMAGE_MAX_TOTAL_SIZE_MB = GIVEAWAY_IMAGE_MAX_TOTAL_SIZE_BYTES / (1024 * 1024);

export const GIVEAWAY_CREATE_COVER_LABEL = "대표사진";

export const GIVEAWAY_EMPTY_DESCRIPTION_LINES = [
  "아직 나눔 글이 없어요.",
  "첫 나눔 글을 작성해 보세요.",
] as const;

export const GIVEAWAY_EMPTY_FILTER_DESCRIPTION_LINES = [
  "검색 결과가 없어요.",
  "다른 검색어나 필터로 다시 찾아보세요.",
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

export const GIVEAWAY_REQUEST_MESSAGE_MAX_LENGTH = 1000;

export const GIVEAWAY_REQUEST_EMPTY_BUTTON_LABEL = "나눔 글 보러가기";

export const GIVEAWAY_REQUEST_EMPTY_DESCRIPTION_LINES = [
  "아직 신청한 나눔이 없어요.",
  "나눔 글을 둘러보고 신청해 보세요.",
] as const;

export const GIVEAWAY_REQUEST_STATUS_LABEL = {
  [GIVEAWAY_REQUEST_STATUS.PENDING]: "신청 완료",
  [GIVEAWAY_REQUEST_STATUS.SELECTED]: "선정됨",
  [GIVEAWAY_REQUEST_STATUS.REJECTED]: "거절됨",
  [GIVEAWAY_REQUEST_STATUS.CANCELLED]: "취소됨",
} as const satisfies Record<GiveawayRequestStatus, string>;

export const GIVEAWAY_REQUEST_STATUS_FILTER_OPTIONS = [
  { value: GIVEAWAY_ALL_VALUE, label: "전체" },
  { value: GIVEAWAY_REQUEST_STATUS.PENDING, label: GIVEAWAY_REQUEST_STATUS_LABEL.PENDING },
  { value: GIVEAWAY_REQUEST_STATUS.SELECTED, label: GIVEAWAY_REQUEST_STATUS_LABEL.SELECTED },
  { value: GIVEAWAY_REQUEST_STATUS.REJECTED, label: GIVEAWAY_REQUEST_STATUS_LABEL.REJECTED },
  { value: GIVEAWAY_REQUEST_STATUS.CANCELLED, label: GIVEAWAY_REQUEST_STATUS_LABEL.CANCELLED },
] as const satisfies readonly { value: string; label: string }[];

export const getGiveawayRequestStatusLabel = (status: GiveawayRequestStatus): string => {
  return GIVEAWAY_REQUEST_STATUS_LABEL[status];
};

export const canEditGiveawayRequest = (request: MyGiveawayRequestItem): boolean => {
  return (
    request.status === GIVEAWAY_REQUEST_STATUS.PENDING &&
    request.giveaway.status !== GIVEAWAY_STATUS.COMPLETED
  );
};

export const canCancelGiveawayRequest = (request: MyGiveawayRequestItem): boolean => {
  if (request.giveaway.status === GIVEAWAY_STATUS.COMPLETED) {
    return false;
  }

  if (request.status === GIVEAWAY_REQUEST_STATUS.PENDING) {
    return true;
  }

  return (
    request.status === GIVEAWAY_REQUEST_STATUS.SELECTED &&
    request.giveaway.status === GIVEAWAY_STATUS.IN_PROGRESS
  );
};
