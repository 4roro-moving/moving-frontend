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
export const GIVEAWAY_LIST_INITIAL_LIMIT = 8;
export const GIVEAWAY_LIST_PAGE_LIMIT = 4;

/** 데스크톱 첫 화면(4열 × 2행)까지 썸네일을 preload해 LCP를 당긴다 */
export const GIVEAWAY_ABOVE_THE_FOLD_THUMBNAIL_COUNT = GIVEAWAY_LIST_INITIAL_LIMIT;

export const GIVEAWAY_KEYWORD_MAX_LENGTH = 100;

export const GIVEAWAY_LIST_STALE_TIME_MS = 60 * 1000;
export const GIVEAWAY_STATUS_STALE_TIME_MS = 0;

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

export const GIVEAWAY_DETAIL_TITLE = "나눔글 상세";
export const GIVEAWAY_PREFERRED_REGION_LABEL = "거래 희망 지역";
export const GIVEAWAY_RECEIVED_REQUESTS_TITLE = "받은 신청 내역";
export const GIVEAWAY_RECEIVED_REQUESTS_EMPTY = "아직 받은 신청이 없어요.";
export const GIVEAWAY_RECEIVED_REQUESTS_LOADING = "받은 신청 내역을 불러오는 중";
export const GIVEAWAY_RECEIVED_REQUESTS_ERROR =
  "받은 신청 내역을 불러오지 못했어요. 잠시 후 다시 시도해주세요.";
export const GIVEAWAY_RECEIVED_REQUESTS_NEXT_PAGE_LOADING = "받은 신청을 더 불러오는 중이에요";
export const GIVEAWAY_RECEIVED_REQUESTS_NEXT_PAGE_ERROR = "다음 신청 내역을 불러오지 못했습니다.";
export const GIVEAWAY_REQUEST_STATUS_FIELD_LABEL = "신청 상태";
export const GIVEAWAY_REQUEST_STATUS_FIELD_LABEL_COMPACT = "상태";
export const GIVEAWAY_SHARE_BUTTON_LABEL = "나눔하기";
export const GIVEAWAY_REJECT_BUTTON_LABEL = "거절하기";
export const GIVEAWAY_EDIT_BUTTON_LABEL = "수정하기";
export const GIVEAWAY_DELETE_BUTTON_LABEL = "삭제하기";
export const GIVEAWAY_COMPLETE_BUTTON_LABEL = "나눔 완료";
export const GIVEAWAY_REPORT_BUTTON_LABEL = "신고하기";
export const GIVEAWAY_APPLY_BUTTON_LABEL = "나눔 신청하기";
export const GIVEAWAY_APPLY_SUBMIT_LABEL = "신청하기";
export const GIVEAWAY_APPLY_MODAL_TITLE = "나눔 신청";
export const GIVEAWAY_APPLIED_BUTTON_LABEL = "신청 완료";
export const GIVEAWAY_REQUEST_CONTENT_LABEL = "신청 내용";
export const GIVEAWAY_REQUEST_DATE_LABEL = "신청일";
export const GIVEAWAY_REQUEST_EMPTY_MESSAGE = "없음";

export const canEditGiveaway = (status: GiveawayStatus): boolean => {
  return status === GIVEAWAY_STATUS.AVAILABLE;
};

export const canDeleteGiveaway = (status: GiveawayStatus): boolean => {
  return status === GIVEAWAY_STATUS.AVAILABLE;
};

export const canCompleteGiveaway = (status: GiveawayStatus): boolean => {
  return status === GIVEAWAY_STATUS.IN_PROGRESS;
};

export const canApplyGiveaway = (giveaway: {
  status: GiveawayStatus;
  canRequest: boolean;
}): boolean => {
  return giveaway.status === GIVEAWAY_STATUS.AVAILABLE && giveaway.canRequest;
};

export const hasActiveGiveawayRequest = (requestStatus: string | null | undefined): boolean => {
  return (
    requestStatus === GIVEAWAY_REQUEST_STATUS.PENDING ||
    requestStatus === GIVEAWAY_REQUEST_STATUS.SELECTED
  );
};

export const canSelectGiveawayRequest = (
  giveawayStatus: GiveawayStatus,
  requestStatus: GiveawayRequestStatus,
): boolean => {
  return (
    giveawayStatus === GIVEAWAY_STATUS.AVAILABLE &&
    requestStatus === GIVEAWAY_REQUEST_STATUS.PENDING
  );
};

export const canRejectGiveawayRequest = (
  giveawayStatus: GiveawayStatus,
  requestStatus: GiveawayRequestStatus,
): boolean => {
  return (
    giveawayStatus === GIVEAWAY_STATUS.AVAILABLE &&
    requestStatus === GIVEAWAY_REQUEST_STATUS.PENDING
  );
};

export const GIVEAWAY_FINAL_IMAGE_KEY_PATTERN =
  /^giveaways\/[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}\.(jpg|png|webp)$/i;

export const isReusableGiveawayImageKey = (value: string): boolean => {
  return GIVEAWAY_FINAL_IMAGE_KEY_PATTERN.test(value);
};

export const toGiveawayExistingFormImage = (image: {
  id: number;
  imageUrl: string;
  imageKey: string;
}) => {
  return {
    kind: "existing" as const,
    id: image.id,
    imageUrl: image.imageUrl,
    imageKey: image.imageKey,
  };
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
