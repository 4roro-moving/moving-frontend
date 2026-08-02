"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Controller, useForm } from "react-hook-form";

import Button from "@/components/common/Button/Button";
import Input from "@/components/common/Input/Input";
import Textarea from "@/components/common/Input/Textarea";
import { Text } from "@/components/common/Text";
import ProfileChipGroup from "@/components/profile/ProfileChipGroup";
import ProfileFieldHeader from "@/components/profile/ProfileFieldHeader";
import ProfileImageUploader from "@/components/profile/ProfileImageUploader";
import ProfilePageHeader from "@/components/profile/ProfilePageHeader";
import { useCreateMoverProfile } from "@/hooks/profile/useCreateMoverProfile";
import { useUpdateMoverProfile } from "@/hooks/profile/useUpdateMoverProfile";
import { getApiErrorMessage } from "@/lib/api/getApiErrorMessage";
import { getRoleHomePath } from "@/lib/auth/redirect";
import { MOVE_TYPE_OPTIONS } from "@/lib/constants/moveType";
import { REGION_OPTIONS, type RegionId } from "@/lib/constants/region";
import { uploadProfileImageIfNeeded } from "@/lib/profile/uploadProfileImage";
import { moverProfileSchema, type MoverProfileFormValues } from "@/lib/schemas/moverProfileSchema";
import type { MoveType } from "@/types/move";
import type { ProfileFormMode } from "@/types/profile";

interface MoverProfileFormProps {
  mode?: ProfileFormMode;
  defaultValues?: Partial<MoverProfileFormValues>;
  initialImageUrl?: string | null;
}

const COPY: Record<ProfileFormMode, { title: string; description: string; submitLabel: string }> = {
  create: {
    title: "기사님 프로필 등록",
    description: "추가 정보를 입력하여 회원가입을 완료해주세요.",
    submitLabel: "시작하기",
  },
  edit: {
    title: "기사님 프로필 수정",
    description: "프로필 정보를 수정할 수 있어요.",
    submitLabel: "수정하기",
  },
};

const MoverProfileForm = ({
  mode = "create",
  defaultValues,
  initialImageUrl = null,
}: MoverProfileFormProps) => {
  const router = useRouter();
  const copy = COPY[mode];
  const createMoverProfile = useCreateMoverProfile();
  const updateMoverProfile = useUpdateMoverProfile();
  const [submitError, setSubmitError] = useState<string | null>(null);

  const {
    register,
    control,
    handleSubmit,
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

  const isPending = isSubmitting || createMoverProfile.isPending || updateMoverProfile.isPending;

  const onSubmit = handleSubmit(async (formValues) => {
    setSubmitError(null);

    try {
      const imageUrl = await uploadProfileImageIfNeeded(formValues.imageFile);
      const profileInput = {
        nickname: formValues.nickname,
        career: Number(formValues.career),
        shortIntro: formValues.shortIntro,
        description: formValues.description,
        regionIds: formValues.regionIds,
        serviceTypes: formValues.serviceTypes,
        ...(imageUrl ? { imageUrl } : {}),
      };

      if (mode === "create") {
        await createMoverProfile.mutateAsync(profileInput);
        router.replace(getRoleHomePath("MOVER"));
        return;
      }

      await updateMoverProfile.mutateAsync(profileInput);
    } catch (error) {
      setSubmitError(getApiErrorMessage(error, "프로필 저장에 실패했습니다."));
    }
  });

  return (
    <form
      className="px-margin-mobile mx-auto flex w-full max-w-[1120px] flex-col gap-40 py-32 md:gap-48 md:px-72 md:py-40 lg:px-0 lg:pt-56 lg:pb-70"
      onSubmit={onSubmit}
      noValidate
    >
      <ProfilePageHeader title={copy.title} description={copy.description} />

      <div className="flex w-full flex-col gap-32 lg:flex-row lg:items-start lg:justify-between lg:gap-[120px]">
        <div className="flex w-full flex-col gap-32 lg:w-[500px]">
          <div className="flex flex-col gap-16 md:gap-20">
            <ProfileFieldHeader label="프로필 이미지" />
            <Controller
              name="imageFile"
              control={control}
              render={({ field }) => (
                <ProfileImageUploader
                  value={field.value ?? null}
                  initialPreviewUrl={initialImageUrl}
                  onChange={field.onChange}
                  error={errors.imageFile?.message}
                />
              )}
            />
          </div>

          <div className="flex flex-col gap-10">
            <ProfileFieldHeader label="별명" htmlFor="nickname" required />
            <Input
              id="nickname"
              size="md"
              placeholder="사이트에 노출될 별명을 입력해 주세요"
              error={errors.nickname?.message}
              {...register("nickname")}
            />
          </div>

          <div className="flex flex-col gap-10">
            <ProfileFieldHeader label="경력" htmlFor="career" required />
            <Input
              id="career"
              size="md"
              inputMode="numeric"
              numericOnly
              placeholder="기사님의 경력을 입력해 주세요"
              error={errors.career?.message}
              {...register("career")}
            />
          </div>

          <div className="flex flex-col gap-10">
            <ProfileFieldHeader label="한 줄 소개" htmlFor="shortIntro" required />
            <Input
              id="shortIntro"
              size="md"
              placeholder="한 줄 소개를 입력해 주세요"
              error={errors.shortIntro?.message}
              {...register("shortIntro")}
            />
          </div>
        </div>

        <div className="flex w-full flex-col gap-32 lg:w-[500px]">
          <div className="flex flex-col gap-10">
            <ProfileFieldHeader label="상세 설명" htmlFor="description" required />
            <Textarea
              id="description"
              placeholder="상세 내용을 입력해 주세요"
              error={errors.description?.message}
              {...register("description")}
            />
          </div>

          <div className="flex flex-col gap-16 md:gap-24">
            <ProfileFieldHeader label="제공 서비스" required />
            <Controller
              name="serviceTypes"
              control={control}
              render={({ field }) => (
                <ProfileChipGroup<MoveType>
                  selectionMode="multiple"
                  options={MOVE_TYPE_OPTIONS}
                  value={field.value}
                  onChange={field.onChange}
                  error={errors.serviceTypes?.message}
                />
              )}
            />
          </div>

          <div className="flex flex-col gap-16 md:gap-24">
            <ProfileFieldHeader label="서비스 가능 지역" required />
            <Controller
              name="regionIds"
              control={control}
              render={({ field }) => (
                <ProfileChipGroup<RegionId>
                  selectionMode="multiple"
                  options={REGION_OPTIONS}
                  value={field.value}
                  onChange={field.onChange}
                  error={errors.regionIds?.message}
                  className="max-w-[277px] gap-x-8 gap-y-12 md:max-w-none"
                />
              )}
            />
          </div>
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
            {copy.submitLabel}
          </Button>
        </div>
      </div>
    </form>
  );
};

export default MoverProfileForm;
