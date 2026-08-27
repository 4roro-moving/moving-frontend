import { z } from "zod";

import {
  createPasswordChangeFieldsSchema,
  type PasswordChangeValidationMessages,
} from "@/lib/schemas/passwordChangeFields";
import { createPhoneSchema, type PhoneValidationMessages } from "@/lib/schemas/phoneSchema";

export interface MoverBasicInfoValidationMessages
  extends PhoneValidationMessages, PasswordChangeValidationMessages {
  nameRequired: string;
  nameMax: string;
}

const DEFAULT_MESSAGES: MoverBasicInfoValidationMessages = {
  phoneRequired: "전화번호를 입력해 주세요",
  phoneInvalid: "올바른 전화번호를 입력해 주세요",
  currentPasswordRequired: "현재 비밀번호를 입력해 주세요",
  newPasswordRequired: "새 비밀번호를 입력해 주세요",
  newPasswordMin: "비밀번호는 8자 이상이어야 합니다",
  newPasswordConfirmRequired: "새 비밀번호를 다시 입력해 주세요",
  newPasswordMismatch: "비밀번호가 일치하지 않습니다",
  nameRequired: "성함을 입력해 주세요",
  nameMax: "이름은 50자 이하로 입력해 주세요",
};

export const createMoverBasicInfoEditSchema = (
  messages: MoverBasicInfoValidationMessages = DEFAULT_MESSAGES,
) =>
  z
    .object({
      name: z.string().trim().min(1, messages.nameRequired).max(50, messages.nameMax),
      phone: createPhoneSchema(messages),
    })
    .and(createPasswordChangeFieldsSchema(messages));

export type MoverBasicInfoEditFormValues = z.infer<
  ReturnType<typeof createMoverBasicInfoEditSchema>
>;

export const moverBasicInfoEditSchema = createMoverBasicInfoEditSchema();
