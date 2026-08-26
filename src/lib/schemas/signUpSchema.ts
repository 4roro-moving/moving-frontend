import { z } from "zod";

import { createPhoneSchema } from "@/lib/schemas/phoneSchema";

export interface SignUpValidationMessages {
  nameRequired: string;
  nameMaxLength: string;
  emailRequired: string;
  emailInvalid: string;
  phoneRequired: string;
  phoneInvalid: string;
  passwordRequired: string;
  passwordMinLength: string;
  passwordConfirmRequired: string;
  passwordMismatch: string;
}

const DEFAULT_MESSAGES: SignUpValidationMessages = {
  nameRequired: "성함을 입력해 주세요",
  nameMaxLength: "이름은 50자 이하로 입력해 주세요",
  emailRequired: "이메일을 입력해 주세요",
  emailInvalid: "올바른 이메일 형식이 아닙니다",
  phoneRequired: "전화번호를 입력해 주세요",
  phoneInvalid: "올바른 전화번호를 입력해 주세요",
  passwordRequired: "비밀번호를 입력해 주세요",
  passwordMinLength: "비밀번호는 8자 이상이어야 합니다",
  passwordConfirmRequired: "비밀번호를 다시 입력해 주세요",
  passwordMismatch: "비밀번호가 일치하지 않습니다",
};

export const createSignUpSchema = (messages: SignUpValidationMessages = DEFAULT_MESSAGES) =>
  z
    .object({
      name: z.string().trim().min(1, messages.nameRequired).max(50, messages.nameMaxLength),
      email: z.string().trim().min(1, messages.emailRequired).email(messages.emailInvalid),
      phone: createPhoneSchema({
        phoneRequired: messages.phoneRequired,
        phoneInvalid: messages.phoneInvalid,
      }),
      password: z.string().min(1, messages.passwordRequired).min(8, messages.passwordMinLength),
      passwordConfirm: z.string().min(1, messages.passwordConfirmRequired),
    })
    .refine((data) => data.password === data.passwordConfirm, {
      message: messages.passwordMismatch,
      path: ["passwordConfirm"],
    });

export const signUpSchema = createSignUpSchema();

export type SignUpFormValues = z.infer<ReturnType<typeof createSignUpSchema>>;
