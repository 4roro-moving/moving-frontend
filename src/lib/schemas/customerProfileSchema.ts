import { z } from "zod";

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

export interface CustomerProfileValidationMessages {
  phoneRequired: string;
  phoneInvalid: string;
  serviceRequired: string;
  regionRequired: string;
}

const DEFAULT_MESSAGES: CustomerProfileValidationMessages = {
  phoneRequired: "전화번호를 입력해 주세요",
  phoneInvalid: "올바른 전화번호를 입력해 주세요",
  serviceRequired: "이용 서비스를 선택해 주세요",
  regionRequired: "내가 사는 지역을 선택해 주세요",
};

export const createCustomerProfileSchema = (options: {
  requiresPhone: boolean;
  messages?: CustomerProfileValidationMessages;
}) => {
  const messages = options.messages ?? DEFAULT_MESSAGES;

  const localizedPhoneSchema = z
    .string()
    .trim()
    .min(1, messages.phoneRequired)
    .regex(/^01[016789]-?\d{3,4}-?\d{4}$/, messages.phoneInvalid)
    .transform((value) => value.replaceAll("-", ""));

  return z
    .object({
      phone: options.requiresPhone ? localizedPhoneSchema : z.string().optional(),
      imageFile: z.custom<File | null>().nullable().optional(),
      serviceTypes: z.array(moveTypeSchema).min(1, messages.serviceRequired),
      regionId: regionIdSchema.nullable(),
    })
    .refine((data) => data.regionId !== null, {
      message: messages.regionRequired,
      path: ["regionId"],
    });
};

export type CustomerProfileFormValues = z.infer<ReturnType<typeof createCustomerProfileSchema>>;

/** @deprecated createCustomerProfileSchema 사용 */
export const customerProfileSchema = createCustomerProfileSchema({ requiresPhone: false });
