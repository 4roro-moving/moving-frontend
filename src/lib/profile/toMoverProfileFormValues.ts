import type { MoverProfileFormValues } from "@/lib/schemas/moverProfileSchema";
import type { MoverProfileMe } from "@/types/profile";
import type { RegionId } from "@/lib/constants/region";
import type { AddressSearchItem } from "@/lib/kakao/addressSearch";

export const toMoverProfileFormValues = (
  moverProfile: MoverProfileMe,
): Partial<MoverProfileFormValues> => {
  // 기사 활동 거점
  const activityBaseAddress: AddressSearchItem | null = moverProfile.activityBase
    ? {
        id: `activity-base-${moverProfile.id}`,
        zipCode: moverProfile.activityBase.zipCode,
        roadAddress: moverProfile.activityBase.address,
        jibunAddress: "",
        sido: "",
        latitude: moverProfile.activityBase.latitude,
        longitude: moverProfile.activityBase.longitude,
      }
    : null;

  return {
    imageFile: null,
    nickname: moverProfile.nickname,
    career: String(moverProfile.career),
    shortIntro: moverProfile.shortIntro,
    description: moverProfile.description,
    activityBaseAddress,
    activityBaseDetailAddress: moverProfile.activityBase?.detailAddress ?? "",
    serviceTypes: moverProfile.serviceTypes,
    regionIds: moverProfile.regions.map((region) => region.id as RegionId),
  };
};
