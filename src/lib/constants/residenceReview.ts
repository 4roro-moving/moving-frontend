import { RESIDENCE_REVIEW_LIST_SORT, RESIDENCE_REVIEW_RATING } from "@/types/residenceReview";
import type { ResidenceReviewListSort, ResidenceReviewRating } from "@/types/residenceReview";

export const RESIDENCE_REVIEW_PAGE_LIMIT = 10;

export const RESIDENCE_REVIEW_TITLE_MAX_LENGTH = 100;

export const RESIDENCE_REVIEW_CONTENT_MIN_LENGTH = 10;

export const RESIDENCE_REVIEW_CONTENT_MAX_LENGTH = 2000;

export const RESIDENCE_REVIEW_WRITE_BUTTON_LABEL = "거주후기 작성";

export const RESIDENCE_REVIEW_WRITE_LOGIN_DESCRIPTION =
  "거주 후기 작성은 로그인 후 이용할 수 있어요.";

export const RESIDENCE_REVIEW_LIST_STALE_TIME_MS = 60 * 1000;

export const RESIDENCE_REVIEW_SORT_OPTIONS = [
  { value: RESIDENCE_REVIEW_LIST_SORT.CREATED_AT, label: "최신 순" },
  { value: RESIDENCE_REVIEW_LIST_SORT.CREATED_AT_ASC, label: "오래된 순" },
] as const satisfies readonly {
  value: ResidenceReviewListSort;
  label: string;
}[];

export const RESIDENCE_REVIEW_RATING_VALUES = [
  RESIDENCE_REVIEW_RATING.MAX,
  4,
  3,
  2,
  RESIDENCE_REVIEW_RATING.MIN,
] as const satisfies readonly ResidenceReviewRating[];

export const RESIDENCE_REVIEW_RATING_OPTIONS = [
  { value: "all", label: "전체" },
  ...RESIDENCE_REVIEW_RATING_VALUES.map((rating) => ({
    value: String(rating),
    label: `${String(rating)}점`,
  })),
] as const satisfies readonly { value: string; label: string }[];
