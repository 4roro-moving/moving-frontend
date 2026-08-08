"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { Controller, useForm } from "react-hook-form";

import FormField from "@/components/common/FormField/FormField";
import Input from "@/components/common/Input/Input";
import PasswordInput from "@/components/common/Input/PasswordInput";
import { Text } from "@/components/common/Text";
import Toast from "@/components/common/Toast/Toast";
import ProfileChipGroup from "@/components/profile/ProfileChipGroup";
import ProfileFormActions from "@/components/profile/ProfileFormActions";
import ProfileImageUploader from "@/components/profile/ProfileImageUploader";
import ProfilePageHeader from "@/components/profile/ProfilePageHeader";
import { useUpdateCustomerBasicInfo } from "@/hooks/profile/useUpdateCustomerBasicInfo";
import { useUpdateCustomerProfile } from "@/hooks/profile/useUpdateCustomerProfile";
import { getApiErrorMessage } from "@/lib/api/getApiErrorMessage";
import { MOVE_TYPE_OPTIONS } from "@/lib/constants/moveType";
import { REGION_OPTIONS, type RegionId } from "@/lib/constants/region";
import { buildCustomerProfileEditPayloads } from "@/lib/profile/buildCustomerProfileEditPayloads";
import { uploadProfileImage } from "@/lib/profile/uploadProfileImage";
import {
  customerProfileEditSchema,
  type CustomerProfileEditFormValues,
} from "@/lib/schemas/customerProfileEditSchema";
import { ApiError } from "@/types/api";
import type { MoveType } from "@/types/move";

const PROFILE_PARTIAL_SAVE_ERROR =
  "기본정보는 저장되었지만 프로필 정보 저장에 실패했습니다. 다시 시도해 주세요.";

interface CustomerProfileEditFormProps {
  email: string;
  hasPassword: boolean;
  defaultValues?: Partial<CustomerProfileEditFormValues>;
  initialImageUrl?: string | null;
}

const CustomerProfileEditForm = ({
  email,
  hasPassword,
  defaultValues,
  initialImageUrl = null,
}: CustomerProfileEditFormProps) => {
  const updateCustomerBasicInfo = useUpdateCustomerBasicInfo();
  const updateCustomerProfile = useUpdateCustomerProfile();
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const {
    register,
    control,
    handleSubmit,
    setError,
    setFocus,
    getValues,
    reset,
    resetField,
    formState: { errors, isValid, isSubmitting, dirtyFields },
  } = useForm<CustomerProfileEditFormValues>({
    resolver: zodResolver(customerProfileEditSchema),
    mode: "onChange",
    defaultValues: {
      name: "",
      phone: "",
      currentPassword: "",
      newPassword: "",
      newPasswordConfirm: "",
      imageFile: null,
      serviceTypes: [],
      regionId: null,
      ...defaultValues,
    },
  });

  const isPending =
    isSubmitting || updateCustomerBasicInfo.isPending || updateCustomerProfile.isPending;

  const onSubmit = handleSubmit(async (formValues) => {
    setSubmitError(null);

    try {
      if (formValues.regionId === null) {
        setSubmitError("내가 사는 지역을 선택해 주세요");
        return;
      }

      const imageUrl = await uploadProfileImage(formValues.imageFile);
      const { basic, profile } = buildCustomerProfileEditPayloads({
        formValues,
        dirtyFields,
        hasPassword,
        uploadedImageUrl: imageUrl,
      });

      if (!basic && !profile) {
        setSubmitError("변경된 정보가 없습니다.");
        return;
      }

      let didBasicSucceed = false;

      if (basic) {
        await updateCustomerBasicInfo.mutateAsync(basic);
        didBasicSucceed = true;

        // basic/비밀번호만 default 승격. profile 필드 dirty는 유지
        // (profile PATCH 실패 후 재시도 시 payload가 비지 않도록)
        const current = getValues();
        resetField("name", { defaultValue: current.name });
        resetField("phone", { defaultValue: current.phone });
        resetField("currentPassword", { defaultValue: "" });
        resetField("newPassword", { defaultValue: "" });
        resetField("newPasswordConfirm", { defaultValue: "" });
      }

      if (profile) {
        try {
          await updateCustomerProfile.mutateAsync(profile);
        } catch (profileError) {
          if (didBasicSucceed) {
            setSubmitError(PROFILE_PARTIAL_SAVE_ERROR);
            return;
          }

          throw profileError;
        }
      }

      const current = getValues();
      reset({
        ...current,
        currentPassword: "",
        newPassword: "",
        newPasswordConfirm: "",
      });
      setToastMessage("프로필이 수정되었습니다.");
    } catch (error) {
      if (
        error instanceof ApiError &&
        (error.status === 409 || error.code === "CONFLICT") &&
        error.message.includes("전화번호")
      ) {
        setError("phone", {
          type: "server",
          message: error.message,
        });
        setFocus("phone");
        return;
      }

      if (
        error instanceof ApiError &&
        (error.status === 401 || error.code === "UNAUTHORIZED") &&
        error.message.includes("현재 비밀번호")
      ) {
        setError("currentPassword", {
          type: "server",
          message: error.message,
        });
        setFocus("currentPassword");
        return;
      }

      setSubmitError(getApiErrorMessage(error, "프로필 수정에 실패했습니다."));
    }
  });

  return (
    <form
      className="px-margin-mobile mx-auto flex w-full max-w-[1120px] flex-col gap-40 py-32 md:gap-48 md:px-72 md:py-40 lg:px-0 lg:pt-56 lg:pb-70"
      onSubmit={onSubmit}
      noValidate
      autoComplete="off"
    >
      <ProfilePageHeader title="프로필 수정" />

      <div className="flex w-full flex-col gap-32 lg:flex-row lg:items-start lg:justify-between lg:gap-[120px]">
        <div className="flex w-full flex-col gap-32 lg:w-[500px]">
          <FormField label="이름" labelFor="customer-edit-name" required>
            <Input
              id="customer-edit-name"
              size="md"
              placeholder="성함을 입력해 주세요"
              error={errors.name?.message}
              {...register("name")}
            />
          </FormField>

          <FormField label="이메일" labelFor="customer-edit-email">
            <Input
              id="customer-edit-email"
              size="md"
              type="email"
              value={email}
              disabled
              readOnly
            />
          </FormField>

          <FormField label="전화번호" labelFor="customer-edit-phone">
            <Input id="customer-edit-phone" size="md" readOnly disabled {...register("phone")} />
          </FormField>

          {hasPassword ? (
            <>
              <FormField label="현재 비밀번호" labelFor="customer-edit-current-password">
                <PasswordInput
                  id="customer-edit-current-password"
                  size="md"
                  autoComplete="current-password"
                  placeholder="현재 비밀번호를 입력해 주세요"
                  error={errors.currentPassword?.message}
                  {...register("currentPassword")}
                />
              </FormField>

              <FormField label="새 비밀번호" labelFor="customer-edit-new-password">
                <PasswordInput
                  id="customer-edit-new-password"
                  size="md"
                  autoComplete="new-password"
                  placeholder="새 비밀번호를 입력해 주세요"
                  error={errors.newPassword?.message}
                  {...register("newPassword")}
                />
              </FormField>

              <FormField label="새 비밀번호 확인" labelFor="customer-edit-new-password-confirm">
                <PasswordInput
                  id="customer-edit-new-password-confirm"
                  size="md"
                  autoComplete="new-password"
                  placeholder="새 비밀번호를 다시 입력해 주세요"
                  error={errors.newPasswordConfirm?.message}
                  {...register("newPasswordConfirm")}
                />
              </FormField>
            </>
          ) : null}
        </div>

        <div className="flex w-full flex-col gap-32 lg:w-[500px]">
          <FormField label="프로필 이미지" labelFor="customer-edit-profile-image">
            <Controller
              name="imageFile"
              control={control}
              render={({ field }) => (
                <ProfileImageUploader
                  id="customer-edit-profile-image"
                  value={field.value ?? null}
                  initialPreviewUrl={initialImageUrl}
                  onChange={field.onChange}
                  error={errors.imageFile?.message}
                />
              )}
            />
          </FormField>

          <FormField
            label="이용 서비스"
            labelId="customer-edit-service-types-label"
            description="*견적 요청 시 이용 서비스를 선택할 수 있어요."
          >
            <Controller
              name="serviceTypes"
              control={control}
              render={({ field }) => (
                <ProfileChipGroup<MoveType>
                  aria-labelledby="customer-edit-service-types-label"
                  selectionMode="multiple"
                  options={MOVE_TYPE_OPTIONS}
                  value={field.value}
                  onChange={field.onChange}
                  error={errors.serviceTypes?.message}
                />
              )}
            />
          </FormField>

          <FormField
            label="내가 사는 지역"
            labelId="customer-edit-region-label"
            description="*견적 요청 시 지역을 설정할 수 있어요."
          >
            <Controller
              name="regionId"
              control={control}
              render={({ field }) => (
                <ProfileChipGroup<RegionId>
                  aria-labelledby="customer-edit-region-label"
                  selectionMode="single"
                  options={REGION_OPTIONS}
                  value={field.value ?? null}
                  onChange={field.onChange}
                  error={errors.regionId?.message}
                  className="max-w-[277px] gap-x-8 gap-y-12 md:max-w-none"
                />
              )}
            />
          </FormField>
        </div>
      </div>

      {submitError ? (
        <Text as="p" role="alert" variant="md-medium" className="text-text-error text-center">
          {submitError}
        </Text>
      ) : null}

      <ProfileFormActions isSubmitDisabled={!isValid || isPending} />

      {toastMessage ? <Toast onClose={() => setToastMessage(null)}>{toastMessage}</Toast> : null}
    </form>
  );
};

export default CustomerProfileEditForm;
