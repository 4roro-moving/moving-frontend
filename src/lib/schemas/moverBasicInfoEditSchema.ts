import { z } from "zod";

import { passwordChangeFieldsSchema } from "@/lib/schemas/passwordChangeFields";
import { phoneSchema } from "@/lib/schemas/phoneSchema";

export const moverBasicInfoEditSchema = z
  .object({
    name: z.string().trim().min(1, "성함을 입력해 주세요"),
    phone: phoneSchema,
  })
  .and(passwordChangeFieldsSchema);

export type MoverBasicInfoEditFormValues = z.infer<typeof moverBasicInfoEditSchema>;
