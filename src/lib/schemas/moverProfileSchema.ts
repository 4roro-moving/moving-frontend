import { z } from "zod";

import {
  MOVER_PROFILE_CAREER_MAX,
  MOVER_PROFILE_CAREER_MIN,
  MOVER_PROFILE_DESCRIPTION_MAX_LENGTH,
  MOVER_PROFILE_NICKNAME_MAX_LENGTH,
  MOVER_PROFILE_NICKNAME_MIN_LENGTH,
  MOVER_PROFILE_SHORT_INTRO_MAX_LENGTH,
} from "@/lib/constants/profileValidation";
import { createPhoneSchema, type PhoneValidationMessages } from "@/lib/schemas/phoneSchema";
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

export interface MoverProfileValidationMessages extends PhoneValidationMessages {
  nicknameMin: string;
  nicknameMax: string;
  careerRequired: string;
  careerNumeric: string;
  careerRange: string;
  shortIntroRequired: string;
  shortIntroMax: string;
  descriptionRequired: string;
  descriptionMax: string;
  activityBaseRequired: string;
  activityBaseDetailMax: string;
  serviceTypesRequired: string;
  regionIdsRequired: string;
}

const DEFAULT_MESSAGES: MoverProfileValidationMessages = {
  phoneRequired: "전화번호를 입력해 주세요",
  phoneInvalid: "올바른 전화번호를 입력해 주세요",
  nicknameMin: `별명은 ${MOVER_PROFILE_NICKNAME_MIN_LENGTH}자 이상 입력해 주세요`,
  nicknameMax: `별명은 ${MOVER_PROFILE_NICKNAME_MAX_LENGTH}자 이하로 입력해 주세요`,
  careerRequired: "경력을 입력해 주세요",
  careerNumeric: "경력은 숫자만 입력해 주세요",
  careerRange: `경력은 ${MOVER_PROFILE_CAREER_MIN} 이상 ${MOVER_PROFILE_CAREER_MAX} 이하의 정수여야 합니다`,
  shortIntroRequired: "한 줄 소개를 입력해 주세요",
  shortIntroMax: `한 줄 소개는 ${MOVER_PROFILE_SHORT_INTRO_MAX_LENGTH}자 이하로 입력해 주세요`,
  descriptionRequired: "상세 설명을 입력해 주세요",
  descriptionMax: `상세 설명은 ${MOVER_PROFILE_DESCRIPTION_MAX_LENGTH}자 이하로 입력해 주세요`,
  activityBaseRequired: "활동 거점을 선택해 주세요",
  activityBaseDetailMax: "상세 주소는 100자 이하로 입력해 주세요",
  serviceTypesRequired: "제공 서비스를 선택해 주세요",
  regionIdsRequired: "서비스 가능 지역을 선택해 주세요",
};

export const createMoverProfileSchema = (options: {
  requiresPhone: boolean;
  messages?: MoverProfileValidationMessages;
}) => {
  const messages = options.messages ?? DEFAULT_MESSAGES;

  return z.object({
    phone: options.requiresPhone ? createPhoneSchema(messages) : z.string().optional(),
    imageFile: z.custom<File | null>().nullable().optional(),
    shouldRemoveImage: z.boolean().optional(),
    nickname: z
      .string()
      .trim()
      .min(MOVER_PROFILE_NICKNAME_MIN_LENGTH, messages.nicknameMin)
      .max(MOVER_PROFILE_NICKNAME_MAX_LENGTH, messages.nicknameMax),
    career: z
      .string()
      .trim()
      .min(1, messages.careerRequired)
      .regex(/^\d+$/, messages.careerNumeric)
      .refine((value) => {
        const career = Number(value);

        return (
          Number.isInteger(career) &&
          career >= MOVER_PROFILE_CAREER_MIN &&
          career <= MOVER_PROFILE_CAREER_MAX
        );
      }, messages.careerRange),
    shortIntro: z
      .string()
      .trim()
      .min(1, messages.shortIntroRequired)
      .max(MOVER_PROFILE_SHORT_INTRO_MAX_LENGTH, messages.shortIntroMax),
    description: z
      .string()
      .trim()
      .min(1, messages.descriptionRequired)
      .max(MOVER_PROFILE_DESCRIPTION_MAX_LENGTH, messages.descriptionMax),
    activityBaseAddress: z
      .custom<AddressSearchItem | null>()
      .refine((value) => value !== null, messages.activityBaseRequired),
    activityBaseDetailAddress: z
      .string()
      .trim()
      .max(100, messages.activityBaseDetailMax)
      .optional(),
    serviceTypes: z.array(moveTypeSchema).min(1, messages.serviceTypesRequired),
    regionIds: z.array(regionIdSchema).min(1, messages.regionIdsRequired),
  });
};

export type MoverProfileFormValues = z.input<ReturnType<typeof createMoverProfileSchema>>;
export type ValidatedMoverProfileFormValues = z.output<ReturnType<typeof createMoverProfileSchema>>;

/** @deprecated createMoverProfileSchema 사용 */
export const moverProfileSchema = createMoverProfileSchema({
  requiresPhone: false,
});
