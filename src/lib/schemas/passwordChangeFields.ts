import { z } from "zod";

export interface PasswordChangeValidationMessages {
  currentPasswordRequired: string;
  newPasswordRequired: string;
  newPasswordMin: string;
  newPasswordConfirmRequired: string;
  newPasswordMismatch: string;
}

const DEFAULT_MESSAGES: PasswordChangeValidationMessages = {
  currentPasswordRequired: "현재 비밀번호를 입력해 주세요",
  newPasswordRequired: "새 비밀번호를 입력해 주세요",
  newPasswordMin: "비밀번호는 8자 이상이어야 합니다",
  newPasswordConfirmRequired: "새 비밀번호를 다시 입력해 주세요",
  newPasswordMismatch: "비밀번호가 일치하지 않습니다",
};

/** 비밀번호 변경 필드 — 모두 비어 있으면 통과, 하나라도 입력하면 전부 검증 */
export const createPasswordChangeFieldsSchema = (
  messages: PasswordChangeValidationMessages = DEFAULT_MESSAGES,
) =>
  z
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
          message: messages.currentPasswordRequired,
          path: ["currentPassword"],
        });
      }

      if (!data.newPassword) {
        ctx.addIssue({
          code: "custom",
          message: messages.newPasswordRequired,
          path: ["newPassword"],
        });
      } else if (data.newPassword.length < 8) {
        ctx.addIssue({
          code: "custom",
          message: messages.newPasswordMin,
          path: ["newPassword"],
        });
      }

      if (!data.newPasswordConfirm) {
        ctx.addIssue({
          code: "custom",
          message: messages.newPasswordConfirmRequired,
          path: ["newPasswordConfirm"],
        });
      } else if (data.newPassword && data.newPassword !== data.newPasswordConfirm) {
        ctx.addIssue({
          code: "custom",
          message: messages.newPasswordMismatch,
          path: ["newPasswordConfirm"],
        });
      }
    });

export const passwordChangeFieldsSchema = createPasswordChangeFieldsSchema();

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

/** basic/password payload에 실제 비밀번호 변경 필드가 포함됐는지 */
export const hasPasswordChangePayload = (
  payload: { currentPassword?: string; newPassword?: string } | null | undefined,
): boolean => Boolean(payload?.currentPassword && payload?.newPassword);
