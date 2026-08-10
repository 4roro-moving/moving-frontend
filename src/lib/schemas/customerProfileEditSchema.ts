import { z } from "zod";

import { passwordChangeFieldsSchema } from "@/lib/schemas/passwordChangeFields";

const moveTypeSchema = z.enum(["SMALL", "HOME", "OFFICE"]);
const regionIdSchema = z.union([
  z.literal(1),
  z.literal(2),
  z.literal(3),
  z.literal(4),
  z.literal(5),
  z.literal(6),
  z.literal(7),
  z.literal(8),
  z.literal(9),
  z.literal(10),
  z.literal(11),
  z.literal(12),
  z.literal(13),
  z.literal(14),
  z.literal(15),
  z.literal(16),
  z.literal(17),
]);

/**
 * phone은 UI에서 disabled — 형식 검증으로 제출을 막지 않음
 * (변경·전송은 buildCustomerProfileEditPayloads에서 처리)
 */
export const customerProfileEditSchema = z
  .object({
    name: z
      .string()
      .trim()
      .min(1, "성함을 입력해 주세요")
      .max(50, "이름은 50자 이하로 입력해 주세요"),
    phone: z.string(),
    imageFile: z.custom<File | null>().nullable().optional(),
    serviceTypes: z.array(moveTypeSchema).min(1, "이용 서비스를 선택해 주세요"),
    regionId: regionIdSchema.nullable(),
  })
  .and(passwordChangeFieldsSchema)
  .refine((data) => data.regionId !== null, {
    message: "내가 사는 지역을 선택해 주세요",
    path: ["regionId"],
  });

export type CustomerProfileEditFormValues = z.infer<typeof customerProfileEditSchema>;
