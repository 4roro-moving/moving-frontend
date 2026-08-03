"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Controller, useForm } from "react-hook-form";

import Button from "@/components/common/Button/Button";
import FormField from "@/components/common/FormField/FormField";
import Input from "@/components/common/Input/Input";
import Textarea from "@/components/common/Input/Textarea";
import { Text } from "@/components/common/Text";
import ProfileChipGroup from "@/components/profile/ProfileChipGroup";
import ProfileImageUploader from "@/components/profile/ProfileImageUploader";
import ProfilePageHeader from "@/components/profile/ProfilePageHeader";
import { useCreateMoverProfile } from "@/hooks/profile/useCreateMoverProfile";
import { getApiErrorMessage } from "@/lib/api/getApiErrorMessage";
import { getRoleHomePath } from "@/lib/auth/redirect";
import { MOVE_TYPE_OPTIONS } from "@/lib/constants/moveType";
import { REGION_OPTIONS, type RegionId } from "@/lib/constants/region";
import { uploadProfileImageIfNeeded } from "@/lib/profile/uploadProfileImage";
import {
  createMoverProfileSchema,
  type MoverProfileFormValues,
} from "@/lib/schemas/moverProfileSchema";
import { ApiError } from "@/types/api";
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
  const router = useRouter();
  const createMoverProfile = useCreateMoverProfile();
  const [submitError, setSubmitError] = useState<string | null>(null);

  const {
    register,
    control,
    handleSubmit,
    setError,
    formState: { errors, isValid, isSubmitting },
  } = useForm<MoverProfileFormValues>({
    resolver: zodResolver(createMoverProfileSchema({ requiresPhone })),
    mode: "onChange",
    defaultValues: {
      phone: "",
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

  const isPending = isSubmitting || createMoverProfile.isPending;

  const onSubmit = handleSubmit(async (formValues) => {
    setSubmitError(null);

    try {
      const imageUrl = await uploadProfileImageIfNeeded(formValues.imageFile);

      await createMoverProfile.mutateAsync({
        ...(requiresPhone && formValues.phone ? { phone: formValues.phone } : {}),
        nickname: formValues.nickname,
        career: Number(formValues.career),
        shortIntro: formValues.shortIntro,
        description: formValues.description,
        regionIds: formValues.regionIds,
        serviceTypes: formValues.serviceTypes,
        ...(imageUrl ? { imageUrl } : {}),
      });
      router.replace(getRoleHomePath("MOVER"));
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

      setSubmitError(getApiErrorMessage(error, "프로필 저장에 실패했습니다."));
    }
  });

  return (
    <form
      className="px-margin-mobile mx-auto flex w-full max-w-[1120px] flex-col gap-40 py-32 md:gap-48 md:px-72 md:py-40 lg:px-0 lg:pt-56 lg:pb-70"
      onSubmit={onSubmit}
      noValidate
      autoComplete="off"
    >
      <ProfilePageHeader
        title="기사님 프로필 등록"
        description="추가 정보를 입력하여 회원가입을 완료해주세요."
      />

      <div className="flex w-full flex-col gap-32 lg:flex-row lg:items-start lg:justify-between lg:gap-[120px]">
        <div className="flex w-full flex-col gap-32 lg:w-[500px]">
          {requiresPhone ? (
            <FormField label="전화번호" labelFor="mover-create-phone" required>
              <Input
                id="mover-create-phone"
                size="md"
                readOnly
                disabled
                error={errors.phone?.message}
                {...register("phone")}
              />
            </FormField>
          ) : null}

          <FormField label="프로필 이미지">
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
          </FormField>

          <FormField label="별명" labelFor="nickname" required>
            <Input
              id="nickname"
              size="md"
              placeholder="사이트에 노출될 별명을 입력해 주세요"
              error={errors.nickname?.message}
              {...register("nickname")}
            />
          </FormField>

          <FormField label="경력" labelFor="career" required>
            <Input
              id="career"
              size="md"
              inputMode="numeric"
              numericOnly
              placeholder="기사님의 경력을 입력해 주세요"
              error={errors.career?.message}
              {...register("career")}
            />
          </FormField>

          <FormField label="한 줄 소개" labelFor="shortIntro" required>
            <Input
              id="shortIntro"
              size="md"
              placeholder="한 줄 소개를 입력해 주세요"
              error={errors.shortIntro?.message}
              {...register("shortIntro")}
            />
          </FormField>
        </div>

        <div className="flex w-full flex-col gap-32 lg:w-[500px]">
          <FormField label="상세 설명" labelFor="description" required>
            <Textarea
              id="description"
              placeholder="상세 내용을 입력해 주세요"
              error={errors.description?.message}
              {...register("description")}
            />
          </FormField>

          <FormField label="제공 서비스" required>
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
          </FormField>

          <FormField label="서비스 가능 지역" required>
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
            시작하기
          </Button>
        </div>
      </div>
    </form>
  );
};

export default MoverProfileForm;
