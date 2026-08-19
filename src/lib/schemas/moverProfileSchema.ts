import { z } from "zod";

import {
  MOVER_PROFILE_CAREER_MAX,
  MOVER_PROFILE_CAREER_MIN,
  MOVER_PROFILE_DESCRIPTION_MAX_LENGTH,
  MOVER_PROFILE_NICKNAME_MAX_LENGTH,
  MOVER_PROFILE_NICKNAME_MIN_LENGTH,
  MOVER_PROFILE_SHORT_INTRO_MAX_LENGTH,
} from "@/lib/constants/profileValidation";
import { phoneSchema } from "@/lib/schemas/phoneSchema";
import type { AddressSearchItem } from "@/lib/kakao/addressSearch";

const moveTypeSchema = z.enum(["SMALL", "HOME", "OFFICE"]);

const regionIdSchema = z.union([
  z.literal(1),
  z.literal(2),
  z.literal(3),
  z.literal(4),
  z.literal(5),
  z.literal(6),
  z.literal(7),
  z.literal(8),
  z.literal(9),
  z.literal(10),
  z.literal(11),
  z.literal(12),
  z.literal(13),
  z.literal(14),
  z.literal(15),
  z.literal(16),
  z.literal(17),
]);

export const createMoverProfileSchema = (options: { requiresPhone: boolean }) =>
  z.object({
    phone: options.requiresPhone ? phoneSchema : z.string().optional(),
    imageFile: z.custom<File | null>().nullable().optional(),
    nickname: z
      .string()
      .trim()
      .min(
        MOVER_PROFILE_NICKNAME_MIN_LENGTH,
        `별명은 ${MOVER_PROFILE_NICKNAME_MIN_LENGTH}자 이상 입력해 주세요`,
      )
      .max(
        MOVER_PROFILE_NICKNAME_MAX_LENGTH,
        `별명은 ${MOVER_PROFILE_NICKNAME_MAX_LENGTH}자 이하로 입력해 주세요`,
      ),
    career: z
      .string()
      .trim()
      .min(1, "경력을 입력해 주세요")
      .regex(/^\d+$/, "경력은 숫자만 입력해 주세요")
      .refine((value) => {
        const career = Number(value);

        return (
          Number.isInteger(career) &&
          career >= MOVER_PROFILE_CAREER_MIN &&
          career <= MOVER_PROFILE_CAREER_MAX
        );
      }, `경력은 ${MOVER_PROFILE_CAREER_MIN} 이상 ${MOVER_PROFILE_CAREER_MAX} 이하의 정수여야 합니다`),
    shortIntro: z
      .string()
      .trim()
      .min(1, "한 줄 소개를 입력해 주세요")
      .max(
        MOVER_PROFILE_SHORT_INTRO_MAX_LENGTH,
        `한 줄 소개는 ${MOVER_PROFILE_SHORT_INTRO_MAX_LENGTH}자 이하로 입력해 주세요`,
      ),
    description: z
      .string()
      .trim()
      .min(1, "상세 설명을 입력해 주세요")
      .max(
        MOVER_PROFILE_DESCRIPTION_MAX_LENGTH,
        `상세 설명은 ${MOVER_PROFILE_DESCRIPTION_MAX_LENGTH}자 이하로 입력해 주세요`,
      ),
    activityBaseAddress: z
      .custom<AddressSearchItem | null>()
      .refine((value) => value !== null, "활동 거점을 선택해 주세요"),
    activityBaseDetailAddress: z
      .string()
      .trim()
      .max(100, "상세 주소는 100자 이하로 입력해 주세요")
      .optional(),
    serviceTypes: z.array(moveTypeSchema).min(1, "제공 서비스를 선택해 주세요"),
    regionIds: z.array(regionIdSchema).min(1, "서비스 가능 지역을 선택해 주세요"),
  });

export type MoverProfileFormValues = z.input<ReturnType<typeof createMoverProfileSchema>>;
export type ValidatedMoverProfileFormValues = z.output<ReturnType<typeof createMoverProfileSchema>>;

/** @deprecated createMoverProfileSchema 사용 */
export const moverProfileSchema = createMoverProfileSchema({
  requiresPhone: false,
});
