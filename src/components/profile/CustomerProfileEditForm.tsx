"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useTranslations } from "next-intl";
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
import { useProfileLocalizedOptions } from "@/components/profile/useProfileLocalizedOptions";
import { useCustomerProfileEditForm } from "@/hooks/profile/useCustomerProfileEditForm";
import { CUSTOMER_PROFILE_NAME_MAX_LENGTH } from "@/lib/constants/profileValidation";
import { type RegionId } from "@/lib/constants/region";
import {
  createCustomerProfileEditSchema,
  type CustomerProfileEditValidationMessages,
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
  const t = useTranslations("profile");
  const { moveTypeOptions, regionOptions } = useProfileLocalizedOptions();
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
    resolver: zodResolver(
      createCustomerProfileEditSchema({
        nameRequired: t("validation.nameRequired"),
        nameMax: t("validation.nameMax", { max: CUSTOMER_PROFILE_NAME_MAX_LENGTH }),
        serviceRequired: t("validation.serviceRequired"),
        regionRequired: t("validation.regionRequired"),
        currentPasswordRequired: t("validation.currentPasswordRequired"),
        newPasswordRequired: t("validation.newPasswordRequired"),
        newPasswordMin: t("validation.newPasswordMin"),
        newPasswordConfirmRequired: t("validation.newPasswordConfirmRequired"),
        newPasswordMismatch: t("validation.newPasswordMismatch"),
      } satisfies CustomerProfileEditValidationMessages),
    ),
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
      messages: {
        noChanges: t("editNoChanges"),
        partialSaveFailed: t("editPartialSaveFailed"),
        saveSuccess: t("editSaveSuccess"),
        saveFailed: t("editSaveFailed"),
      },
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
      <ProfilePageHeader title={t("editTitle")} />

      <div className="flex w-full flex-col gap-32 lg:flex-row lg:items-start lg:justify-between lg:gap-[120px]">
        <div className="flex w-full flex-col gap-32 lg:w-[500px]">
          <FormField
            label={t("name")}
            labelFor="customer-edit-name"
            required
            requiredLabel={t("requiredField")}
          >
            <Input
              id="customer-edit-name"
              size="md"
              placeholder={t("namePlaceholder")}
              error={errors.name?.message}
              maxLength={CUSTOMER_PROFILE_NAME_MAX_LENGTH}
              disabled={isPending}
              {...register("name")}
            />
          </FormField>

          <FormField label={t("email")} labelFor="customer-edit-email">
            <Input
              id="customer-edit-email"
              size="md"
              type="email"
              value={email}
              disabled
              readOnly
            />
          </FormField>

          <FormField label={t("phone")} labelFor="customer-edit-phone">
            <Input id="customer-edit-phone" size="md" readOnly disabled {...register("phone")} />
          </FormField>

          {hasPassword ? (
            <>
              <FormField label={t("currentPassword")} labelFor="customer-edit-current-password">
                <PasswordInput
                  id="customer-edit-current-password"
                  size="md"
                  autoComplete="current-password"
                  placeholder={t("currentPasswordPlaceholder")}
                  showPasswordAriaLabel={t("showPassword")}
                  hidePasswordAriaLabel={t("hidePassword")}
                  error={errors.currentPassword?.message}
                  disabled={isPending}
                  {...register("currentPassword")}
                />
              </FormField>

              <FormField label={t("newPassword")} labelFor="customer-edit-new-password">
                <PasswordInput
                  id="customer-edit-new-password"
                  size="md"
                  autoComplete="new-password"
                  placeholder={t("newPasswordPlaceholder")}
                  showPasswordAriaLabel={t("showPassword")}
                  hidePasswordAriaLabel={t("hidePassword")}
                  error={errors.newPassword?.message}
                  disabled={isPending}
                  {...register("newPassword")}
                />
              </FormField>

              <FormField
                label={t("newPasswordConfirm")}
                labelFor="customer-edit-new-password-confirm"
              >
                <PasswordInput
                  id="customer-edit-new-password-confirm"
                  size="md"
                  autoComplete="new-password"
                  placeholder={t("newPasswordConfirmPlaceholder")}
                  showPasswordAriaLabel={t("showPassword")}
                  hidePasswordAriaLabel={t("hidePassword")}
                  error={errors.newPasswordConfirm?.message}
                  disabled={isPending}
                  {...register("newPasswordConfirm")}
                />
              </FormField>
            </>
          ) : null}
        </div>

        <div className="flex w-full flex-col gap-32 lg:w-[500px]">
          <FormField label={t("image")} labelFor="customer-edit-profile-image">
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
                    if (file) {
                      setValue("shouldRemoveImage", false, { shouldDirty: true });
                    }
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
            label={t("services")}
            labelId="customer-edit-service-types-label"
            description={t("editServicesHint")}
          >
            <Controller
              name="serviceTypes"
              control={control}
              render={({ field }) => (
                <ProfileChipGroup<MoveType>
                  aria-labelledby="customer-edit-service-types-label"
                  selectionMode="multiple"
                  options={moveTypeOptions}
                  value={field.value}
                  onChange={field.onChange}
                  error={errors.serviceTypes?.message}
                  disabled={isPending}
                />
              )}
            />
          </FormField>

          <FormField
            label={t("region")}
            labelId="customer-edit-region-label"
            description={t("editRegionHint")}
          >
            <Controller
              name="regionId"
              control={control}
              render={({ field }) => (
                <ProfileChipGroup<RegionId>
                  aria-labelledby="customer-edit-region-label"
                  selectionMode="single"
                  options={regionOptions}
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
