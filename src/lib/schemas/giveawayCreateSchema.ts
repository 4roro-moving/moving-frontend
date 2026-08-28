import { z } from "zod";

import {
  GIVEAWAY_DESCRIPTION_MAX_LENGTH,
  GIVEAWAY_DESCRIPTION_MIN_LENGTH,
  GIVEAWAY_IMAGE_MAX_COUNT,
  GIVEAWAY_IMAGE_MAX_SIZE_BYTES,
  GIVEAWAY_IMAGE_MAX_SIZE_MB,
  GIVEAWAY_IMAGE_MAX_TOTAL_SIZE_BYTES,
  GIVEAWAY_IMAGE_MAX_TOTAL_SIZE_MB,
  GIVEAWAY_TITLE_MAX_LENGTH,
  GIVEAWAY_TITLE_MIN_LENGTH,
} from "@/lib/constants/giveaway";
import { isRegionId, type RegionId } from "@/lib/constants/region";
import { isGiveawayImageContentType, type GiveawayFormImage } from "@/types/giveaway";

const regionIdSchema = z.custom<RegionId>(
  (value) => typeof value === "number" && isRegionId(value),
  { message: "지역을 선택해 주세요." },
);

const giveawayNewFileSchema = z
  .custom<File>((value) => value instanceof File, {
    message: "이미지를 등록해 주세요.",
  })
  .refine((file) => isGiveawayImageContentType(file.type), {
    message: "jpg, png, webp 형식의 이미지만 등록할 수 있습니다.",
  })
  .refine((file) => file.size <= GIVEAWAY_IMAGE_MAX_SIZE_BYTES, {
    message: `이미지는 ${String(GIVEAWAY_IMAGE_MAX_SIZE_MB)}MB 이하여야 합니다.`,
  });

const giveawayFormImageSchema = z.discriminatedUnion("kind", [
  z.object({
    kind: z.literal("existing"),
    id: z.number(),
    imageUrl: z.string(),
    imageKey: z.string(),
  }),
  z.object({
    kind: z.literal("new"),
    file: giveawayNewFileSchema,
  }),
]);

const getNewImageTotalSize = (images: GiveawayFormImage[]) => {
  return images.reduce((total, image) => {
    return image.kind === "new" ? total + image.file.size : total;
  }, 0);
};

export const giveawayCreateSchema = z
  .object({
    regionId: regionIdSchema.nullable(),
    title: z
      .string()
      .trim()
      .min(GIVEAWAY_TITLE_MIN_LENGTH, "제목을 입력해 주세요.")
      .max(
        GIVEAWAY_TITLE_MAX_LENGTH,
        `제목은 ${String(GIVEAWAY_TITLE_MAX_LENGTH)}자 이하여야 합니다.`,
      ),
    description: z
      .string()
      .trim()
      .min(GIVEAWAY_DESCRIPTION_MIN_LENGTH, "설명을 입력해 주세요.")
      .max(
        GIVEAWAY_DESCRIPTION_MAX_LENGTH,
        `설명은 ${String(GIVEAWAY_DESCRIPTION_MAX_LENGTH)}자 이하여야 합니다.`,
      ),
    images: z
      .array(giveawayFormImageSchema)
      .min(1, "이미지를 1장 이상 등록해 주세요.")
      .max(
        GIVEAWAY_IMAGE_MAX_COUNT,
        `이미지는 최대 ${String(GIVEAWAY_IMAGE_MAX_COUNT)}장까지 등록할 수 있습니다.`,
      )
      .refine((images) => getNewImageTotalSize(images) <= GIVEAWAY_IMAGE_MAX_TOTAL_SIZE_BYTES, {
        message: `이미지 총 용량은 ${String(GIVEAWAY_IMAGE_MAX_TOTAL_SIZE_MB)}MB 이하여야 합니다.`,
      }),
  })
  .refine((data) => data.regionId !== null, {
    message: "지역을 선택해 주세요.",
    path: ["regionId"],
  });

export type GiveawayCreateFormValues = z.infer<typeof giveawayCreateSchema>;
