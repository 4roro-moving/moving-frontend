"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useTranslations } from "next-intl";
import { Controller, useForm } from "react-hook-form";

import Button from "@/components/common/Button/Button";
import FormField from "@/components/common/FormField/FormField";
import Input from "@/components/common/Input/Input";
import Textarea from "@/components/common/Input/Textarea";
import { Text } from "@/components/common/Text";
import ProfileChipGroup from "@/components/profile/ProfileChipGroup";
import MoverActivityBaseFields from "@/components/profile/MoverActivityBaseFields";
import ProfileImageUploader from "@/components/profile/ProfileImageUploader";
import ProfilePageHeader from "@/components/profile/ProfilePageHeader";
import { useProfileLocalizedOptions } from "@/components/profile/useProfileLocalizedOptions";
import { useMoverProfileCreateForm } from "@/hooks/profile/useMoverProfileCreateForm";
import {
  MOVER_PROFILE_CAREER_MAX,
  MOVER_PROFILE_CAREER_MIN,
  MOVER_PROFILE_DESCRIPTION_MAX_LENGTH,
  MOVER_PROFILE_NICKNAME_MAX_LENGTH,
  MOVER_PROFILE_NICKNAME_MIN_LENGTH,
  MOVER_PROFILE_SHORT_INTRO_MAX_LENGTH,
} from "@/lib/constants/profileValidation";
import { type RegionId } from "@/lib/constants/region";
import {
  createMoverProfileSchema,
  type MoverProfileValidationMessages,
  type MoverProfileFormValues,
  type ValidatedMoverProfileFormValues,
} from "@/lib/schemas/moverProfileSchema";
import { preventEnterSubmitOnInput } from "@/lib/utils/preventEnterSubmitOnInput";
import type { MoveType } from "@/types/move";

interface MoverProfileFormProps {
  /** status.hasPhone === false 일 때 전화번호 입력 필요 */
  requiresPhone?: boolean;
  defaultValues?: Partial<MoverProfileFormValues>;
  initialImageUrl?: string | null;
}

const MoverProfileForm = ({
  requiresPhone = false,
  defaultValues,
  initialImageUrl = null,
}: MoverProfileFormProps) => {
  const t = useTranslations("profile");
  const { moveTypeOptions, regionOptions } = useProfileLocalizedOptions();
  const {
    register,
    control,
    handleSubmit,
    setError,
    setFocus,
    formState: { errors, isValid },
  } = useForm<MoverProfileFormValues, unknown, ValidatedMoverProfileFormValues>({
    resolver: zodResolver(
      createMoverProfileSchema({
        requiresPhone,
        messages: {
          phoneRequired: t("validation.phoneRequired"),
          phoneInvalid: t("validation.phoneInvalid"),
          nicknameMin: t("validation.moverNicknameMin", {
            min: MOVER_PROFILE_NICKNAME_MIN_LENGTH,
          }),
          nicknameMax: t("validation.moverNicknameMax", {
            max: MOVER_PROFILE_NICKNAME_MAX_LENGTH,
          }),
          careerRequired: t("validation.moverCareerRequired"),
          careerNumeric: t("validation.moverCareerNumeric"),
          careerRange: t("validation.moverCareerRange", {
            min: MOVER_PROFILE_CAREER_MIN,
            max: MOVER_PROFILE_CAREER_MAX,
          }),
          shortIntroRequired: t("validation.moverShortIntroRequired"),
          shortIntroMax: t("validation.moverShortIntroMax", {
            max: MOVER_PROFILE_SHORT_INTRO_MAX_LENGTH,
          }),
          descriptionRequired: t("validation.moverDescriptionRequired"),
          descriptionMax: t("validation.moverDescriptionMax", {
            max: MOVER_PROFILE_DESCRIPTION_MAX_LENGTH,
          }),
          activityBaseRequired: t("validation.moverActivityBaseRequired"),
          activityBaseDetailMax: t("validation.moverActivityBaseDetailMax", { max: 100 }),
          serviceTypesRequired: t("validation.moverServiceTypesRequired"),
          regionIdsRequired: t("validation.moverRegionIdsRequired"),
        } satisfies MoverProfileValidationMessages,
      }),
    ),
    mode: "onChange",
    defaultValues: {
      phone: "",
      imageFile: null,
      nickname: "",
      career: "",
      shortIntro: "",
      description: "",
      activityBaseAddress: null,
      activityBaseDetailAddress: "",
      serviceTypes: [],
      regionIds: [],
      ...defaultValues,
    },
  });

  const { submitError, isPending, submit } = useMoverProfileCreateForm({
    requiresPhone,
    createFailedMessage: t("moverCreateFailed"),
    activityBaseRequiredMessage: t("validation.moverActivityBaseRequired"),
    setError,
    setFocus,
  });

  const onSubmit = handleSubmit((formValues) => submit(formValues));

  return (
    <form
      className="px-margin-mobile mx-auto flex w-full max-w-[1120px] flex-col gap-40 py-32 md:gap-48 md:px-72 md:py-40 lg:px-0 lg:pt-56 lg:pb-70"
      onSubmit={onSubmit}
      onKeyDown={preventEnterSubmitOnInput}
      noValidate
      autoComplete="off"
    >
      <ProfilePageHeader title={t("moverCreateTitle")} description={t("createDescription")} />

      <div className="flex w-full flex-col gap-32 lg:flex-row lg:items-start lg:justify-between lg:gap-[120px]">
        <div className="flex w-full flex-col gap-32 lg:w-[500px]">
          {requiresPhone ? (
            <FormField
              label={t("phone")}
              labelFor="mover-create-phone"
              required
              requiredLabel={t("requiredField")}
            >
              <Input
                id="mover-create-phone"
                size="md"
                inputMode="numeric"
                numericOnly
                stripLeadingZeros={false}
                placeholder={t("phonePlaceholder")}
                error={errors.phone?.message}
                disabled={isPending}
                {...register("phone")}
              />
            </FormField>
          ) : null}

          <FormField label={t("image")} labelFor="mover-profile-image">
            <Controller
              name="imageFile"
              control={control}
              render={({ field }) => (
                <ProfileImageUploader
                  id="mover-profile-image"
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

          <FormField
            label={t("moverNickname")}
            labelFor="nickname"
            required
            requiredLabel={t("requiredField")}
          >
            <Input
              id="nickname"
              size="md"
              placeholder={t("moverNicknamePlaceholder")}
              error={errors.nickname?.message}
              maxLength={MOVER_PROFILE_NICKNAME_MAX_LENGTH}
              disabled={isPending}
              {...register("nickname")}
            />
          </FormField>

          <FormField
            label={t("moverCareer")}
            labelFor="career"
            required
            requiredLabel={t("requiredField")}
          >
            <Input
              id="career"
              size="md"
              inputMode="numeric"
              numericOnly
              placeholder={t("moverCareerPlaceholder")}
              error={errors.career?.message}
              disabled={isPending}
              {...register("career")}
            />
          </FormField>

          <FormField
            label={t("moverShortIntro")}
            labelFor="shortIntro"
            required
            requiredLabel={t("requiredField")}
          >
            <Input
              id="shortIntro"
              size="md"
              placeholder={t("moverShortIntroPlaceholder")}
              error={errors.shortIntro?.message}
              maxLength={MOVER_PROFILE_SHORT_INTRO_MAX_LENGTH}
              disabled={isPending}
              {...register("shortIntro")}
            />
          </FormField>
        </div>

        <div className="flex w-full flex-col gap-32 lg:w-[500px]">
          <FormField
            label={t("moverDescription")}
            labelFor="description"
            required
            requiredLabel={t("requiredField")}
          >
            <Textarea
              id="description"
              placeholder={t("moverDescriptionPlaceholder")}
              error={errors.description?.message}
              maxLength={MOVER_PROFILE_DESCRIPTION_MAX_LENGTH}
              disabled={isPending}
              {...register("description")}
            />
          </FormField>

          {/*기사 활동 거점*/}
          <MoverActivityBaseFields control={control} disabled={isPending} idPrefix="mover-create" />

          <FormField
            label={t("moverServices")}
            labelId="mover-create-service-types-label"
            required
            requiredLabel={t("requiredField")}
          >
            <Controller
              name="serviceTypes"
              control={control}
              render={({ field }) => (
                <ProfileChipGroup<MoveType>
                  aria-labelledby="mover-create-service-types-label"
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
            label={t("moverRegions")}
            labelId="mover-create-region-label"
            required
            requiredLabel={t("requiredField")}
          >
            <Controller
              name="regionIds"
              control={control}
              render={({ field }) => (
                <ProfileChipGroup<RegionId>
                  aria-labelledby="mover-create-region-label"
                  selectionMode="multiple"
                  options={regionOptions}
                  value={field.value}
                  onChange={field.onChange}
                  error={errors.regionIds?.message}
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

      <div className="flex w-full justify-end">
        <div className="w-full lg:w-[500px]">
          <Button
            type="submit"
            variant="solid"
            size="auth"
            fullWidth
            disabled={!isValid || isPending}
          >
            {t("start")}
          </Button>
        </div>
      </div>
    </form>
  );
};

export default MoverProfileForm;
