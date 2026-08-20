import {
  RESIDENCE_REVIEW_CONTENT_MAX_LENGTH,
  RESIDENCE_REVIEW_CONTENT_MIN_LENGTH,
  RESIDENCE_REVIEW_TITLE_MAX_LENGTH,
} from "@/lib/constants/residenceReview";

export const getResidenceReviewTitleError = (title: string) => {
  const trimmed = title.trim();
  if (!trimmed) {
    return "제목을 입력해 주세요.";
  }
  if (trimmed.length > RESIDENCE_REVIEW_TITLE_MAX_LENGTH) {
    return `제목은 ${String(RESIDENCE_REVIEW_TITLE_MAX_LENGTH)}자 이하여야 합니다.`;
  }
  return undefined;
};

export const getResidenceReviewContentError = (content: string) => {
  const trimmed = content.trim();
  if (trimmed.length < RESIDENCE_REVIEW_CONTENT_MIN_LENGTH) {
    return `내용은 ${String(RESIDENCE_REVIEW_CONTENT_MIN_LENGTH)}자 이상 입력해 주세요.`;
  }
  if (trimmed.length > RESIDENCE_REVIEW_CONTENT_MAX_LENGTH) {
    return `내용은 ${String(RESIDENCE_REVIEW_CONTENT_MAX_LENGTH)}자 이하여야 합니다.`;
  }
  return undefined;
};
