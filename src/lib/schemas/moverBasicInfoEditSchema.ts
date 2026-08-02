import { z } from "zod";

import { passwordChangeFieldsSchema } from "@/lib/schemas/passwordChangeFields";

export const moverBasicInfoEditSchema = z
  .object({
    name: z.string().trim().min(1, "성함을 입력해 주세요"),
    phone: z
      .string()
      .min(1, "전화번호를 입력해 주세요")
      .regex(/^\d+$/, "숫자만 입력해 주세요")
      .min(10, "올바른 전화번호를 입력해 주세요")
      .max(11, "올바른 전화번호를 입력해 주세요"),
  })
  .and(passwordChangeFieldsSchema);

export type MoverBasicInfoEditFormValues = z.infer<typeof moverBasicInfoEditSchema>;
