import { z } from "zod";

import { isRegionId, type RegionId } from "@/lib/constants/region";
import {
  RESIDENCE_REVIEW_TITLE_MIN_LENGTH,
  RESIDENCE_REVIEW_CONTENT_MAX_LENGTH,
  RESIDENCE_REVIEW_CONTENT_MIN_LENGTH,
  RESIDENCE_REVIEW_TITLE_MAX_LENGTH,
} from "@/lib/constants/residenceReview";
import { RESIDENCE_REVIEW_RATING } from "@/types/residenceReview";

const regionIdSchema = z.custom<RegionId>(
  (value) => typeof value === "number" && isRegionId(value),
  { message: "지역을 선택해 주세요." },
);

export const residenceReviewFormFieldsSchema = z.object({
  title: z
    .string()
    .trim()
    .min(RESIDENCE_REVIEW_TITLE_MIN_LENGTH, "제목을 입력해 주세요.")
    .max(
      RESIDENCE_REVIEW_TITLE_MAX_LENGTH,
      `제목은 ${String(RESIDENCE_REVIEW_TITLE_MAX_LENGTH)}자 이하여야 합니다.`,
    ),
  content: z
    .string()
    .trim()
    .min(
      RESIDENCE_REVIEW_CONTENT_MIN_LENGTH,
      `내용은 ${String(RESIDENCE_REVIEW_CONTENT_MIN_LENGTH)}자 이상 입력해 주세요.`,
    )
    .max(
      RESIDENCE_REVIEW_CONTENT_MAX_LENGTH,
      `내용은 ${String(RESIDENCE_REVIEW_CONTENT_MAX_LENGTH)}자 이하여야 합니다.`,
    ),
  rating: z
    .number()
    .refine(
      (value) => value >= RESIDENCE_REVIEW_RATING.MIN && value <= RESIDENCE_REVIEW_RATING.MAX,
      { message: "평점을 선택해 주세요." },
    ),
});

export const residenceReviewCreateSchema = residenceReviewFormFieldsSchema
  .extend({
    regionId: regionIdSchema.nullable(),
  })
  .refine((data) => data.regionId !== null, {
    message: "지역을 선택해 주세요.",
    path: ["regionId"],
  });

export const residenceReviewEditSchema = residenceReviewFormFieldsSchema;

export type ResidenceReviewFormFieldValues = z.infer<typeof residenceReviewFormFieldsSchema>;
export type ResidenceReviewCreateFormValues = z.infer<typeof residenceReviewCreateSchema>;
export type ResidenceReviewEditFormValues = z.infer<typeof residenceReviewEditSchema>;
