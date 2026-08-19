import { RESIDENCE_REVIEW_LIST_SORT, RESIDENCE_REVIEW_RATING } from "@/types/residenceReview";
import type { ResidenceReviewListSort, ResidenceReviewRating } from "@/types/residenceReview";

export const RESIDENCE_REVIEW_PAGE_LIMIT = 10;

export const RESIDENCE_REVIEW_LIST_STALE_TIME_MS = 60 * 1000;

export const RESIDENCE_REVIEW_SORT_OPTIONS: {
  value: ResidenceReviewListSort;
  label: string;
}[] = [
  { value: RESIDENCE_REVIEW_LIST_SORT.CREATED_AT, label: "최신 순" },
  { value: RESIDENCE_REVIEW_LIST_SORT.CREATED_AT_ASC, label: "오래된 순" },
];

export const RESIDENCE_REVIEW_RATING_VALUES: ResidenceReviewRating[] = [
  RESIDENCE_REVIEW_RATING.MAX,
  4,
  3,
  2,
  RESIDENCE_REVIEW_RATING.MIN,
];

export const RESIDENCE_REVIEW_RATING_OPTIONS: { value: string; label: string }[] = [
  { value: "all", label: "전체" },
  ...RESIDENCE_REVIEW_RATING_VALUES.map((rating) => ({
    value: String(rating),
    label: `${String(rating)}점`,
  })),
];
