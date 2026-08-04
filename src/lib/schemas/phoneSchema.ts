import { z } from "zod";

/**
 * BE phone 규칙과 동일
 * - 검증: `/^01[016789]-?\d{3,4}-?\d{4}$/` (하이픈 위치까지 검사)
 * - 저장용 변환: 하이픈 제거
 *
 * @see moving-backend auth/profile phoneSchema
 */
export const phoneSchema = z
  .string()
  .trim()
  .min(1, "전화번호를 입력해 주세요")
  .regex(/^01[016789]-?\d{3,4}-?\d{4}$/, "올바른 전화번호를 입력해 주세요")
  .transform((value) => value.replaceAll("-", ""));
