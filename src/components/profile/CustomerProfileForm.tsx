"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";
import { useState } from "react";
import { Controller, useForm } from "react-hook-form";

import Button from "@/components/common/Button/Button";
import FormField from "@/components/common/FormField/FormField";
import Input from "@/components/common/Input/Input";
import { Text } from "@/components/common/Text";
import ProfileChipGroup from "@/components/profile/ProfileChipGroup";
import ProfileImageUploader from "@/components/profile/ProfileImageUploader";
import ProfilePageHeader from "@/components/profile/ProfilePageHeader";
import { useProfileLocalizedOptions } from "@/components/profile/useProfileLocalizedOptions";
import { useCreateCustomerProfile } from "@/hooks/profile/useCreateCustomerProfile";
import { getApiErrorMessage } from "@/lib/api/getApiErrorMessage";
import { getRoleHomePath } from "@/lib/auth/redirect";
import { type RegionId } from "@/lib/constants/region";
import { uploadProfileImage } from "@/lib/profile/uploadProfileImage";
import {
  createCustomerProfileSchema,
  type CustomerProfileValidationMessages,
  type CustomerProfileFormValues,
} from "@/lib/schemas/customerProfileSchema";
import { preventEnterSubmitOnInput } from "@/lib/utils/preventEnterSubmitOnInput";
import { ApiError } from "@/types/api";
import type { MoveType } from "@/types/move";

interface CustomerProfileFormProps {
  /** status.hasPhone === false 일 때 전화번호 입력 필요 */
  requiresPhone?: boolean;
  defaultValues?: Partial<CustomerProfileFormValues>;
  initialImageUrl?: string | null;
}

const CustomerProfileForm = ({
  requiresPhone = false,
  defaultValues,
  initialImageUrl = null,
}: CustomerProfileFormProps) => {
  const t = useTranslations("profile");
  const { moveTypeOptions, regionOptions } = useProfileLocalizedOptions();
  const router = useRouter();
  const createCustomerProfile = useCreateCustomerProfile();
  const [submitError, setSubmitError] = useState<string | null>(null);

  const {
    register,
    control,
    handleSubmit,
    setError,
    formState: { errors, isValid, isSubmitting },
  } = useForm<CustomerProfileFormValues>({
    resolver: zodResolver(
      createCustomerProfileSchema({
        requiresPhone,
        messages: {
          phoneRequired: t("validation.phoneRequired"),
          phoneInvalid: t("validation.phoneInvalid"),
          serviceRequired: t("validation.serviceRequired"),
          regionRequired: t("validation.regionRequired"),
        } satisfies CustomerProfileValidationMessages,
      }),
    ),
    mode: "onChange",
    defaultValues: {
      phone: "",
      imageFile: null,
      serviceTypes: [],
      regionId: null,
      ...defaultValues,
    },
  });

  const isPending = isSubmitting || createCustomerProfile.isPending;

  const onSubmit = handleSubmit(async (formValues) => {
    setSubmitError(null);

    try {
      if (formValues.regionId === null) {
        setSubmitError(t("validation.regionRequired"));
        return;
      }

      const imageKey = await uploadProfileImage(formValues.imageFile);

      await createCustomerProfile.mutateAsync({
        ...(requiresPhone && formValues.phone ? { phone: formValues.phone } : {}),
        ...(imageKey ? { imageUrl: imageKey } : {}),
        regionIds: [formValues.regionId],
        serviceTypes: formValues.serviceTypes,
      });
      router.replace(getRoleHomePath("CUSTOMER"));
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
        return;
      }

      setSubmitError(getApiErrorMessage(error, t("createFailed")));
    }
  });

  return (
    <form
      className="px-margin-mobile mx-auto flex w-full max-w-[640px] flex-col gap-40 py-32 md:px-72 md:py-40 lg:px-0 lg:pt-56 lg:pb-70"
      onSubmit={onSubmit}
      onKeyDown={preventEnterSubmitOnInput}
      noValidate
      autoComplete="off"
    >
      <ProfilePageHeader title={t("createTitle")} description={t("createDescription")} />

      <div className="flex w-full flex-col gap-32">
        {requiresPhone ? (
          <FormField label={t("phone")} labelFor="customer-create-phone" required>
            <Input
              id="customer-create-phone"
              size="md"
              inputMode="numeric"
              numericOnly
              stripLeadingZeros={false}
              placeholder={t("phonePlaceholder")}
              error={errors.phone?.message}
              {...register("phone")}
            />
          </FormField>
        ) : null}

        <section className="flex w-full flex-col gap-32">
          <FormField label={t("image")} labelFor="customer-profile-image">
            <Controller
              name="imageFile"
              control={control}
              render={({ field }) => (
                <ProfileImageUploader
                  id="customer-profile-image"
                  value={field.value ?? null}
                  initialPreviewUrl={initialImageUrl}
                  onChange={field.onChange}
                  onClear={() => field.onChange(null)}
                  error={errors.imageFile?.message}
                  disabled={isPending}
                />
              )}
            />
          </FormField>
          <div className="border-border-subtle w-full border-b" aria-hidden="true" />
        </section>

        <section className="flex w-full flex-col gap-32">
          <FormField
            label={t("services")}
            labelId="customer-create-service-types-label"
            description={t("createServicesHint")}
          >
            <Controller
              name="serviceTypes"
              control={control}
              render={({ field }) => (
                <ProfileChipGroup<MoveType>
                  aria-labelledby="customer-create-service-types-label"
                  selectionMode="multiple"
                  options={moveTypeOptions}
                  value={field.value}
                  onChange={field.onChange}
                  error={errors.serviceTypes?.message}
                />
              )}
            />
          </FormField>
          <div className="border-border-subtle w-full border-b" aria-hidden="true" />
        </section>

        <FormField
          label={t("region")}
          labelId="customer-create-region-label"
          description={t("createRegionHint")}
        >
          <Controller
            name="regionId"
            control={control}
            render={({ field }) => (
              <ProfileChipGroup<RegionId>
                aria-labelledby="customer-create-region-label"
                selectionMode="single"
                options={regionOptions}
                value={field.value ?? null}
                onChange={field.onChange}
                error={errors.regionId?.message}
                className="max-w-[277px] gap-x-8 gap-y-12 md:max-w-none"
              />
            )}
          />
        </FormField>
      </div>

      {submitError ? (
        <Text as="p" role="alert" variant="md-medium" className="text-text-error text-center">
          {submitError}
        </Text>
      ) : null}

      <Button type="submit" variant="solid" size="auth" fullWidth disabled={!isValid || isPending}>
        {t("start")}
      </Button>
    </form>
  );
};

export default CustomerProfileForm;
