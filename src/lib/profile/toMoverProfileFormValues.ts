import type { MoverProfileFormValues } from "@/lib/schemas/moverProfileSchema";
import type { MoverProfileMe } from "@/types/profile";
import type { RegionId } from "@/lib/constants/region";

export const toMoverProfileFormValues = (
  moverProfile: MoverProfileMe,
): Partial<MoverProfileFormValues> => {
  return {
    imageFile: null,
    nickname: moverProfile.nickname,
    career: String(moverProfile.career),
    shortIntro: moverProfile.shortIntro,
    description: moverProfile.description,
    serviceTypes: moverProfile.serviceTypes,
    regionIds: moverProfile.regions.map((region) => region.id as RegionId),
  };
};
