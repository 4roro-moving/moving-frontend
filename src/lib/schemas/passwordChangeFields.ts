import { z } from "zod";

/** 비밀번호 변경 필드 — 모두 비어 있으면 통과, 하나라도 입력하면 전부 검증 */
export const passwordChangeFieldsSchema = z
  .object({
    currentPassword: z.string(),
    newPassword: z.string(),
    newPasswordConfirm: z.string(),
  })
  .superRefine((data, ctx) => {
    const hasAny = Boolean(data.currentPassword || data.newPassword || data.newPasswordConfirm);

    if (!hasAny) {
      return;
    }

    if (!data.currentPassword) {
      ctx.addIssue({
        code: "custom",
        message: "현재 비밀번호를 입력해 주세요",
        path: ["currentPassword"],
      });
    }

    if (!data.newPassword) {
      ctx.addIssue({
        code: "custom",
        message: "새 비밀번호를 입력해 주세요",
        path: ["newPassword"],
      });
    } else if (data.newPassword.length < 8) {
      ctx.addIssue({
        code: "custom",
        message: "비밀번호는 8자 이상이어야 합니다",
        path: ["newPassword"],
      });
    }

    if (!data.newPasswordConfirm) {
      ctx.addIssue({
        code: "custom",
        message: "새 비밀번호를 다시 입력해 주세요",
        path: ["newPasswordConfirm"],
      });
    } else if (data.newPassword && data.newPassword !== data.newPasswordConfirm) {
      ctx.addIssue({
        code: "custom",
        message: "비밀번호가 일치하지 않습니다",
        path: ["newPasswordConfirm"],
      });
    }
  });

export type PasswordChangeFields = z.infer<typeof passwordChangeFieldsSchema>;

export const toPasswordChangePayload = (
  values: PasswordChangeFields,
): Partial<PasswordChangeFields> => {
  if (!values.currentPassword && !values.newPassword && !values.newPasswordConfirm) {
    return {};
  }

  return {
    currentPassword: values.currentPassword,
    newPassword: values.newPassword,
    newPasswordConfirm: values.newPasswordConfirm,
  };
};
