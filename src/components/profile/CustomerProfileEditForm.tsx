"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, useForm, useWatch } from "react-hook-form";

import FormField from "@/components/common/FormField/FormField";
import Input from "@/components/common/Input/Input";
import PasswordInput from "@/components/common/Input/PasswordInput";
import { Text } from "@/components/common/Text";
import Toast from "@/components/common/Toast/Toast";
import ProfileChipGroup from "@/components/profile/ProfileChipGroup";
import ProfileFormActions from "@/components/profile/ProfileFormActions";
import ProfileImageUploader from "@/components/profile/ProfileImageUploader";
import ProfilePageHeader from "@/components/profile/ProfilePageHeader";
import { useCustomerProfileEditForm } from "@/hooks/profile/useCustomerProfileEditForm";
import { MOVE_TYPE_OPTIONS } from "@/lib/constants/moveType";
import { CUSTOMER_PROFILE_NAME_MAX_LENGTH } from "@/lib/constants/profileValidation";
import { REGION_OPTIONS, type RegionId } from "@/lib/constants/region";
import {
  customerProfileEditSchema,
  type CustomerProfileEditFormValues,
} from "@/lib/schemas/customerProfileEditSchema";
import { preventEnterSubmitOnInput } from "@/lib/utils/preventEnterSubmitOnInput";
import type { MoveType } from "@/types/move";

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
  const {
    register,
    control,
    handleSubmit,
    setError,
    setFocus,
    reset,
    resetField,
    setValue,
    formState: { errors, isValid, dirtyFields, isDirty },
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
      shouldRemoveImage: false,
      serviceTypes: [],
      regionId: null,
      ...defaultValues,
    },
  });

  const shouldRemoveImage = useWatch({ control, name: "shouldRemoveImage" }) ?? false;

  const { submitError, toastMessage, isPending, setToastMessage, submit } =
    useCustomerProfileEditForm({
      hasPassword,
      reset,
      resetField,
      setError,
      setFocus,
    });

  const onSubmit = handleSubmit((formValues) => submit(formValues, dirtyFields));

  return (
    <form
      className="px-margin-mobile mx-auto flex w-full max-w-[1120px] flex-col gap-40 py-32 md:gap-48 md:px-72 md:py-40 lg:px-0 lg:pt-56 lg:pb-70"
      onSubmit={onSubmit}
      onKeyDown={preventEnterSubmitOnInput}
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
              maxLength={CUSTOMER_PROFILE_NAME_MAX_LENGTH}
              disabled={isPending}
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
                  disabled={isPending}
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
                  disabled={isPending}
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
                  disabled={isPending}
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
                  initialPreviewUrl={shouldRemoveImage ? null : initialImageUrl}
                  onChange={(file) => {
                    field.onChange(file);
                  }}
                  onClear={() => {
                    field.onChange(null);
                    setValue("shouldRemoveImage", true, { shouldDirty: true });
                  }}
                  error={errors.imageFile?.message}
                  disabled={isPending}
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
                  disabled={isPending}
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
                  disabled={isPending}
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

      <ProfileFormActions isSubmitDisabled={!isValid || isPending || !isDirty} />

      {toastMessage ? <Toast onClose={() => setToastMessage(null)}>{toastMessage}</Toast> : null}
    </form>
  );
};

export default CustomerProfileEditForm;
