import { z } from "zod";

export interface PhoneValidationMessages {
  phoneRequired: string;
  phoneInvalid: string;
}

const DEFAULT_MESSAGES: PhoneValidationMessages = {
  phoneRequired: "전화번호를 입력해 주세요",
  phoneInvalid: "올바른 전화번호를 입력해 주세요",
};

/**
 * BE phone 규칙과 동일
 * - 검증: `/^01[016789]-?\d{3,4}-?\d{4}$/` (하이픈 위치까지 검사)
 * - 저장용 변환: 하이픈 제거
 *
 * @see moving-backend auth/profile phoneSchema
 */
export const createPhoneSchema = (messages: PhoneValidationMessages = DEFAULT_MESSAGES) =>
  z
    .string()
    .trim()
    .min(1, messages.phoneRequired)
    .regex(/^01[016789]-?\d{3,4}-?\d{4}$/, messages.phoneInvalid)
    .transform((value) => value.replaceAll("-", ""));

export const phoneSchema = createPhoneSchema();
