import type { CustomerProfileEditFormValues } from "@/lib/schemas/customerProfileEditSchema";
import { toPasswordChangePayload } from "@/lib/schemas/passwordChangeFields";
import type { MoveType } from "@/types/move";
import type { UpdateCustomerBasicInfoInput, UpdateCustomerProfileInput } from "@/types/profile";

interface BuildCustomerProfileEditPayloadsParams {
  formValues: CustomerProfileEditFormValues;
  initial: {
    name: string;
    phone: string;
    regionId: number | null;
    serviceTypes: MoveType[];
  };
  hasPassword: boolean;
  /** 새로 업로드된 URL. 없으면 이미지 미변경 */
  uploadedImageUrl?: string;
}

const areSameServiceTypes = (left: MoveType[], right: MoveType[]) => {
  if (left.length !== right.length) {
    return false;
  }

  const sortedLeft = [...left].sort();
  const sortedRight = [...right].sort();

  return sortedLeft.every((value, index) => value === sortedRight[index]);
};

/** 고객 프로필 수정 폼 값에서 basic / profile PATCH 변경분만 만듭니다. */
export const buildCustomerProfileEditPayloads = ({
  formValues,
  initial,
  hasPassword,
  uploadedImageUrl,
}: BuildCustomerProfileEditPayloadsParams) => {
  const basic: UpdateCustomerBasicInfoInput = {};

  if (formValues.name.trim() !== initial.name.trim()) {
    basic.name = formValues.name.trim();
  }

  // phone은 UI에서 disabled — 값이 바뀌지 않는 한 payload에 넣지 않음
  if (formValues.phone !== initial.phone) {
    basic.phone = formValues.phone;
  }

  if (hasPassword) {
    Object.assign(basic, toPasswordChangePayload(formValues));
  }

  const profile: UpdateCustomerProfileInput = {};

  if (formValues.regionId !== null && formValues.regionId !== initial.regionId) {
    profile.regionIds = [formValues.regionId];
  }

  if (!areSameServiceTypes(formValues.serviceTypes, initial.serviceTypes)) {
    profile.serviceTypes = formValues.serviceTypes;
  }

  if (uploadedImageUrl) {
    profile.imageUrl = uploadedImageUrl;
  }

  const hasBasicUpdate = Object.keys(basic).length > 0;
  const hasProfileUpdate = Object.keys(profile).length > 0;

  return {
    basic: hasBasicUpdate ? basic : null,
    profile: hasProfileUpdate ? profile : null,
  };
};
