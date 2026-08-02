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

export const customerProfileEditSchema = z
  .object({
    name: z.string().trim().min(1, "성함을 입력해 주세요"),
    phone: z
      .string()
      .min(1, "전화번호를 입력해 주세요")
      .regex(/^\d+$/, "숫자만 입력해 주세요")
      .regex(/^010\d{8}$/, "올바른 전화번호를 입력해 주세요"),
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
