import type { CustomerProfileEditFormValues } from "@/lib/schemas/customerProfileEditSchema";
import { toPasswordChangePayload } from "@/lib/schemas/passwordChangeFields";
import type { UpdateCustomerBasicInfoInput, UpdateCustomerProfileInput } from "@/types/profile";

interface BuildCustomerProfileEditPayloadsParams {
  formValues: CustomerProfileEditFormValues;
  /** RHF dirtyFields — 변경된 필드만 PATCH에 포함 */
  dirtyFields: Partial<Record<keyof CustomerProfileEditFormValues, unknown>>;
  hasPassword: boolean;
  /** 새로 업로드된 URL. 없으면 이미지 미변경 */
  uploadedImageUrl?: string;
}

const isFieldDirty = (value: unknown): boolean => Boolean(value);

/** 고객 프로필 수정 폼 값에서 basic / profile PATCH 변경분만 만듭니다. */
export const buildCustomerProfileEditPayloads = ({
  formValues,
  dirtyFields,
  hasPassword,
  uploadedImageUrl,
}: BuildCustomerProfileEditPayloadsParams) => {
  const basic: UpdateCustomerBasicInfoInput = {};

  if (isFieldDirty(dirtyFields.name)) {
    basic.name = formValues.name.trim();
  }

  // phone은 UI에서 disabled — dirty일 때만 (실제로는 거의 없음)
  if (isFieldDirty(dirtyFields.phone)) {
    basic.phone = formValues.phone;
  }

  if (hasPassword) {
    Object.assign(basic, toPasswordChangePayload(formValues));
  }

  const profile: UpdateCustomerProfileInput = {};

  if (isFieldDirty(dirtyFields.regionId) && formValues.regionId !== null) {
    profile.regionIds = [formValues.regionId];
  }

  if (isFieldDirty(dirtyFields.serviceTypes)) {
    profile.serviceTypes = formValues.serviceTypes;
  }

  if (uploadedImageUrl) {
    profile.imageUrl = uploadedImageUrl;
  } else if (formValues.shouldRemoveImage) {
    profile.imageUrl = null;
  }

  const hasBasicUpdate = Object.keys(basic).length > 0;
  const hasProfileUpdate = Object.keys(profile).length > 0;

  return {
    basic: hasBasicUpdate ? basic : null,
    profile: hasProfileUpdate ? profile : null,
  };
};
