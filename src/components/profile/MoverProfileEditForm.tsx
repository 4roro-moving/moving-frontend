"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { Controller, useForm } from "react-hook-form";

import FormField from "@/components/common/FormField/FormField";
import Input from "@/components/common/Input/Input";
import Textarea from "@/components/common/Input/Textarea";
import { Text } from "@/components/common/Text";
import Toast from "@/components/common/Toast/Toast";
import ProfileChipGroup from "@/components/profile/ProfileChipGroup";
import ProfileFormActions from "@/components/profile/ProfileFormActions";
import ProfileImageUploader from "@/components/profile/ProfileImageUploader";
import ProfilePageHeader from "@/components/profile/ProfilePageHeader";
import { useUpdateMoverProfile } from "@/hooks/profile/useUpdateMoverProfile";
import { getApiErrorMessage } from "@/lib/api/getApiErrorMessage";
import { MOVE_TYPE_OPTIONS } from "@/lib/constants/moveType";
import { REGION_OPTIONS, type RegionId } from "@/lib/constants/region";
import { uploadProfileImage } from "@/lib/profile/uploadProfileImage";
import { moverProfileSchema, type MoverProfileFormValues } from "@/lib/schemas/moverProfileSchema";
import { ApiError } from "@/types/api";
import type { MoveType } from "@/types/move";

interface MoverProfileEditFormProps {
  defaultValues?: Partial<MoverProfileFormValues>;
  initialImageUrl?: string | null;
}

const MoverProfileEditForm = ({
  defaultValues,
  initialImageUrl = null,
}: MoverProfileEditFormProps) => {
  const updateMoverProfile = useUpdateMoverProfile();
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const {
    register,
    control,
    handleSubmit,
    setError,
    setFocus,
    formState: { errors, isValid, isSubmitting },
  } = useForm<MoverProfileFormValues>({
    resolver: zodResolver(moverProfileSchema),
    mode: "onChange",
    defaultValues: {
      imageFile: null,
      nickname: "",
      career: "",
      shortIntro: "",
      description: "",
      serviceTypes: [],
      regionIds: [],
      ...defaultValues,
    },
  });

  const isPending = isSubmitting || updateMoverProfile.isPending;

  const onSubmit = handleSubmit(async (formValues) => {
    setSubmitError(null);

    try {
      const imageKey = await uploadProfileImage(formValues.imageFile);

      await updateMoverProfile.mutateAsync({
        nickname: formValues.nickname,
        career: Number(formValues.career),
        shortIntro: formValues.shortIntro,
        description: formValues.description,
        regionIds: formValues.regionIds,
        serviceTypes: formValues.serviceTypes,
        ...(imageKey ? { imageUrl: imageKey } : {}),
      });
      setToastMessage("프로필이 수정되었습니다.");
    } catch (error) {
      if (
        error instanceof ApiError &&
        (error.status === 409 || error.code === "CONFLICT") &&
        (error.message.includes("닉네임") || error.message.includes("별명"))
      ) {
        setError("nickname", {
          type: "server",
          message: error.message,
        });
        setFocus("nickname");
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
    >
      <ProfilePageHeader title="프로필 수정" />

      <div className="flex w-full flex-col gap-32 lg:flex-row lg:items-start lg:justify-between lg:gap-[120px]">
        <div className="flex w-full flex-col gap-32 lg:w-[500px]">
          <FormField label="프로필 이미지" labelFor="mover-edit-profile-image">
            <Controller
              name="imageFile"
              control={control}
              render={({ field }) => (
                <ProfileImageUploader
                  id="mover-edit-profile-image"
                  value={field.value ?? null}
                  initialPreviewUrl={initialImageUrl}
                  onChange={field.onChange}
                  error={errors.imageFile?.message}
                />
              )}
            />
          </FormField>

          <FormField label="별명" labelFor="mover-edit-nickname" required>
            <Input
              id="mover-edit-nickname"
              size="md"
              placeholder="사이트에 노출될 별명을 입력해 주세요"
              error={errors.nickname?.message}
              {...register("nickname")}
            />
          </FormField>

          <FormField label="경력" labelFor="mover-edit-career" required>
            <Input
              id="mover-edit-career"
              size="md"
              inputMode="numeric"
              numericOnly
              placeholder="기사님의 경력을 입력해 주세요"
              error={errors.career?.message}
              {...register("career")}
            />
          </FormField>

          <FormField label="한 줄 소개" labelFor="mover-edit-shortIntro" required>
            <Input
              id="mover-edit-shortIntro"
              size="md"
              placeholder="한 줄 소개를 입력해 주세요"
              error={errors.shortIntro?.message}
              {...register("shortIntro")}
            />
          </FormField>
        </div>

        <div className="flex w-full flex-col gap-32 lg:w-[500px]">
          <FormField label="상세 설명" labelFor="mover-edit-description" required>
            <Textarea
              id="mover-edit-description"
              placeholder="상세 내용을 입력해 주세요"
              error={errors.description?.message}
              {...register("description")}
            />
          </FormField>

          <FormField label="제공 서비스" labelId="mover-edit-service-types-label" required>
            <Controller
              name="serviceTypes"
              control={control}
              render={({ field }) => (
                <ProfileChipGroup<MoveType>
                  aria-labelledby="mover-edit-service-types-label"
                  selectionMode="multiple"
                  options={MOVE_TYPE_OPTIONS}
                  value={field.value}
                  onChange={field.onChange}
                  error={errors.serviceTypes?.message}
                />
              )}
            />
          </FormField>

          <FormField label="서비스 가능 지역" labelId="mover-edit-region-label" required>
            <Controller
              name="regionIds"
              control={control}
              render={({ field }) => (
                <ProfileChipGroup<RegionId>
                  aria-labelledby="mover-edit-region-label"
                  selectionMode="multiple"
                  options={REGION_OPTIONS}
                  value={field.value}
                  onChange={field.onChange}
                  error={errors.regionIds?.message}
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

export default MoverProfileEditForm;
