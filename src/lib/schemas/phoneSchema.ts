import { z } from "zod";

/**
 * BE phone 규칙과 맞춤
 * `/^01[016789]-?\d{3,4}-?\d{4}$/` → 하이픈 제거 후 `01[016789]` + 7~8자리
 */
export const phoneSchema = z
  .string()
  .trim()
  .min(1, "전화번호를 입력해 주세요")
  .transform((value) => value.replaceAll("-", ""))
  .pipe(
    z
      .string()
      .regex(/^\d+$/, "숫자만 입력해 주세요")
      .regex(/^01[016789]\d{7,8}$/, "올바른 전화번호를 입력해 주세요"),
  );
