import { z } from "zod";

import { CUSTOMER_PROFILE_NAME_MAX_LENGTH } from "@/lib/constants/profileValidation";
import {
  createPasswordChangeFieldsSchema,
  type PasswordChangeValidationMessages,
} from "@/lib/schemas/passwordChangeFields";

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

export interface CustomerProfileEditValidationMessages extends PasswordChangeValidationMessages {
  nameRequired: string;
  nameMax: string;
  serviceRequired: string;
  regionRequired: string;
}

const DEFAULT_MESSAGES: CustomerProfileEditValidationMessages = {
  nameRequired: "성함을 입력해 주세요",
  nameMax: `이름은 ${CUSTOMER_PROFILE_NAME_MAX_LENGTH}자 이하로 입력해 주세요`,
  serviceRequired: "이용 서비스를 선택해 주세요",
  regionRequired: "내가 사는 지역을 선택해 주세요",
  currentPasswordRequired: "현재 비밀번호를 입력해 주세요",
  newPasswordRequired: "새 비밀번호를 입력해 주세요",
  newPasswordMin: "비밀번호는 8자 이상이어야 합니다",
  newPasswordConfirmRequired: "새 비밀번호를 다시 입력해 주세요",
  newPasswordMismatch: "비밀번호가 일치하지 않습니다",
};

/** phone은 UI에서 disabled — 형식 검증으로 제출을 막지 않음 */
export const createCustomerProfileEditSchema = (
  messages: CustomerProfileEditValidationMessages = DEFAULT_MESSAGES,
) =>
  z
    .object({
      name: z
        .string()
        .trim()
        .min(1, messages.nameRequired)
        .max(CUSTOMER_PROFILE_NAME_MAX_LENGTH, messages.nameMax),
      phone: z.string(),
      imageFile: z.custom<File | null>().nullable().optional(),
      shouldRemoveImage: z.boolean().optional(),
      serviceTypes: z.array(moveTypeSchema).min(1, messages.serviceRequired),
      regionId: regionIdSchema.nullable(),
    })
    .and(createPasswordChangeFieldsSchema(messages))
    .refine((data) => data.regionId !== null, {
      message: messages.regionRequired,
      path: ["regionId"],
    });

export type CustomerProfileEditFormValues = z.infer<
  ReturnType<typeof createCustomerProfileEditSchema>
>;

export const customerProfileEditSchema = createCustomerProfileEditSchema();
