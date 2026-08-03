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

const phoneSchema = z
  .string()
  .min(1, "전화번호를 입력해 주세요")
  .regex(/^\d+$/, "숫자만 입력해 주세요")
  .min(10, "올바른 전화번호를 입력해 주세요")
  .max(11, "올바른 전화번호를 입력해 주세요");

export const createMoverProfileSchema = (options: { requiresPhone: boolean }) =>
  z.object({
    phone: options.requiresPhone ? phoneSchema : z.string().optional(),
    imageFile: z.custom<File | null>().nullable().optional(),
    nickname: z.string().trim().min(2, "별명은 2자 이상 입력해 주세요"),
    career: z
      .string()
      .trim()
      .min(1, "경력을 입력해 주세요")
      .regex(/^\d+$/, "경력은 숫자만 입력해 주세요"),
    shortIntro: z.string().trim().min(1, "한 줄 소개를 입력해 주세요"),
    description: z.string().trim().min(1, "상세 설명을 입력해 주세요"),
    serviceTypes: z.array(moveTypeSchema).min(1, "제공 서비스를 선택해 주세요"),
    regionIds: z.array(regionIdSchema).min(1, "서비스 가능 지역을 선택해 주세요"),
  });

export type MoverProfileFormValues = z.infer<ReturnType<typeof createMoverProfileSchema>>;

/** @deprecated createMoverProfileSchema 사용 */
export const moverProfileSchema = createMoverProfileSchema({ requiresPhone: false });
