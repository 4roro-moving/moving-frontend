import { z } from "zod";

import { phoneSchema } from "@/lib/schemas/phoneSchema";

export const signUpSchema = z
  .object({
    name: z.string().trim().min(1, "성함을 입력해 주세요"),
    email: z
      .string()
      .trim()
      .min(1, "이메일을 입력해 주세요")
      .email("올바른 이메일 형식이 아닙니다"),
    phone: phoneSchema,
    password: z
      .string()
      .min(1, "비밀번호를 입력해 주세요")
      .min(8, "비밀번호는 8자 이상이어야 합니다"),
    passwordConfirm: z.string().min(1, "비밀번호를 다시 입력해 주세요"),
  })
  .refine((data) => data.password === data.passwordConfirm, {
    message: "비밀번호가 일치하지 않습니다",
    path: ["passwordConfirm"],
  });

export type SignUpFormValues = z.infer<typeof signUpSchema>;
