"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useTranslations } from "next-intl";
import { Controller, useForm, useWatch } from "react-hook-form";

import FormField from "@/components/common/FormField/FormField";
import Input from "@/components/common/Input/Input";
import Textarea from "@/components/common/Input/Textarea";
import { Text } from "@/components/common/Text";
import Toast from "@/components/common/Toast/Toast";
import ProfileChipGroup from "@/components/profile/ProfileChipGroup";
import MoverActivityBaseFields from "@/components/profile/MoverActivityBaseFields";
import ProfileFormActions from "@/components/profile/ProfileFormActions";
import ProfileImageUploader from "@/components/profile/ProfileImageUploader";
import ProfilePageHeader from "@/components/profile/ProfilePageHeader";
import { useProfileLocalizedOptions } from "@/components/profile/useProfileLocalizedOptions";
import { useMoverProfileEditForm } from "@/hooks/profile/useMoverProfileEditForm";
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

interface MoverProfileEditFormProps {
  defaultValues?: Partial<MoverProfileFormValues>;
  initialImageUrl?: string | null;
}

const MoverProfileEditForm = ({
  defaultValues,
  initialImageUrl = null,
}: MoverProfileEditFormProps) => {
  const t = useTranslations("profile");
  const { moveTypeOptions, regionOptions } = useProfileLocalizedOptions();
  const {
    register,
    control,
    handleSubmit,
    setError,
    setFocus,
    reset,
    setValue,
    formState: { errors, isValid, isDirty },
  } = useForm<MoverProfileFormValues, unknown, ValidatedMoverProfileFormValues>({
    resolver: zodResolver(
      createMoverProfileSchema({
        requiresPhone: false,
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
      imageFile: null,
      shouldRemoveImage: false,
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

  const shouldRemoveImage = useWatch({ control, name: "shouldRemoveImage" }) ?? false;

  const { submitError, toastMessage, isPending, setToastMessage, submit } = useMoverProfileEditForm(
    {
      saveSuccessMessage: t("editSaveSuccess"),
      saveFailedMessage: t("editSaveFailed"),
      activityBaseRequiredMessage: t("validation.moverActivityBaseRequired"),
      reset,
      setError,
      setFocus,
    },
  );

  const onSubmit = handleSubmit((formValues) => submit(formValues));

  return (
    <form
      className="px-margin-mobile mx-auto flex w-full max-w-[1120px] flex-col gap-40 py-32 md:gap-48 md:px-72 md:py-40 lg:px-0 lg:pt-56 lg:pb-70"
      onSubmit={onSubmit}
      onKeyDown={preventEnterSubmitOnInput}
      noValidate
    >
      <ProfilePageHeader title={t("editTitle")} />

      <div className="flex w-full flex-col gap-32 lg:flex-row lg:items-start lg:justify-between lg:gap-[120px]">
        <div className="flex w-full flex-col gap-32 lg:w-[500px]">
          <FormField label={t("image")} labelFor="mover-edit-profile-image">
            <Controller
              name="imageFile"
              control={control}
              render={({ field }) => (
                <ProfileImageUploader
                  id="mover-edit-profile-image"
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
            label={t("moverNickname")}
            labelFor="mover-edit-nickname"
            required
            requiredLabel={t("requiredField")}
          >
            <Input
              id="mover-edit-nickname"
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
            labelFor="mover-edit-career"
            required
            requiredLabel={t("requiredField")}
          >
            <Input
              id="mover-edit-career"
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
            labelFor="mover-edit-shortIntro"
            required
            requiredLabel={t("requiredField")}
          >
            <Input
              id="mover-edit-shortIntro"
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
            labelFor="mover-edit-description"
            required
            requiredLabel={t("requiredField")}
          >
            <Textarea
              id="mover-edit-description"
              placeholder={t("moverDescriptionPlaceholder")}
              error={errors.description?.message}
              maxLength={MOVER_PROFILE_DESCRIPTION_MAX_LENGTH}
              disabled={isPending}
              {...register("description")}
            />
          </FormField>

          {/* 기사 활동 거점 추가 */}
          <MoverActivityBaseFields control={control} disabled={isPending} idPrefix="mover-edit" />

          <FormField
            label={t("moverServices")}
            labelId="mover-edit-service-types-label"
            required
            requiredLabel={t("requiredField")}
          >
            <Controller
              name="serviceTypes"
              control={control}
              render={({ field }) => (
                <ProfileChipGroup<MoveType>
                  aria-labelledby="mover-edit-service-types-label"
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
            labelId="mover-edit-region-label"
            required
            requiredLabel={t("requiredField")}
          >
            <Controller
              name="regionIds"
              control={control}
              render={({ field }) => (
                <ProfileChipGroup<RegionId>
                  aria-labelledby="mover-edit-region-label"
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

      <ProfileFormActions isSubmitDisabled={!isValid || isPending || !isDirty} />

      {toastMessage ? <Toast onClose={() => setToastMessage(null)}>{toastMessage}</Toast> : null}
    </form>
  );
};

export default MoverProfileEditForm;
