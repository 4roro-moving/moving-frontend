import { z } from "zod";

import { isRegionId, type RegionId } from "@/lib/constants/region";
import {
  RESIDENCE_REVIEW_TITLE_MIN_LENGTH,
  RESIDENCE_REVIEW_CONTENT_MAX_LENGTH,
  RESIDENCE_REVIEW_CONTENT_MIN_LENGTH,
  RESIDENCE_REVIEW_TITLE_MAX_LENGTH,
} from "@/lib/constants/residenceReview";
import { RESIDENCE_REVIEW_RATING } from "@/types/residenceReview";

type Translate = (key: string, values?: Record<string, number>) => string;

export const createResidenceReviewSchemas = (t: Translate) => {
  const regionIdSchema = z.custom<RegionId>(
    (value) => typeof value === "number" && isRegionId(value),
    { message: t("validationRegion") },
  );

  const formFieldsSchema = z.object({
    title: z
      .string()
      .trim()
      .min(RESIDENCE_REVIEW_TITLE_MIN_LENGTH, t("validationTitleRequired"))
      .max(
        RESIDENCE_REVIEW_TITLE_MAX_LENGTH,
        t("validationTitleMax", { count: RESIDENCE_REVIEW_TITLE_MAX_LENGTH }),
      ),
    content: z
      .string()
      .trim()
      .min(
        RESIDENCE_REVIEW_CONTENT_MIN_LENGTH,
        t("validationContentMin", { count: RESIDENCE_REVIEW_CONTENT_MIN_LENGTH }),
      )
      .max(
        RESIDENCE_REVIEW_CONTENT_MAX_LENGTH,
        t("validationContentMax", { count: RESIDENCE_REVIEW_CONTENT_MAX_LENGTH }),
      ),
    rating: z
      .number()
      .refine(
        (value) => value >= RESIDENCE_REVIEW_RATING.MIN && value <= RESIDENCE_REVIEW_RATING.MAX,
        { message: t("validationRating") },
      ),
  });

  return {
    formFieldsSchema,
    createSchema: formFieldsSchema
      .extend({ regionId: regionIdSchema.nullable() })
      .refine((data) => data.regionId !== null, {
        message: t("validationRegion"),
        path: ["regionId"],
      }),
    editSchema: formFieldsSchema,
  };
};

export type ResidenceReviewFormFieldValues = { title: string; content: string; rating: number };
export type ResidenceReviewCreateFormValues = ResidenceReviewFormFieldValues & {
  regionId: RegionId | null;
};
export type ResidenceReviewEditFormValues = ResidenceReviewFormFieldValues;
