"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, useForm } from "react-hook-form";

import Button from "@/components/common/Button/Button";
import ProfileChipGroup from "@/components/profile/ProfileChipGroup";
import ProfileFieldHeader from "@/components/profile/ProfileFieldHeader";
import ProfileImageUploader from "@/components/profile/ProfileImageUploader";
import ProfilePageHeader from "@/components/profile/ProfilePageHeader";
import { MOVE_TYPE_OPTIONS } from "@/lib/constants/moveType";
import { REGION_OPTIONS, type RegionId } from "@/lib/constants/region";
import {
  customerProfileSchema,
  type CustomerProfileFormValues,
} from "@/lib/schemas/customerProfileSchema";
import type { ProfileFormMode } from "@/types/profileFormMode";
import type { MoveType } from "@/types/move";

interface CustomerProfileFormProps {
  mode?: ProfileFormMode;
  defaultValues?: Partial<CustomerProfileFormValues>;
  initialImageUrl?: string | null;
}

const COPY: Record<ProfileFormMode, { title: string; description: string; submitLabel: string }> = {
  create: {
    title: "프로필 등록",
    description: "추가 정보를 입력하여 회원가입을 완료해주세요.",
    submitLabel: "시작하기",
  },
  edit: {
    title: "프로필 수정",
    description: "프로필 정보를 수정할 수 있어요.",
    submitLabel: "수정하기",
  },
};

const CustomerProfileForm = ({
  mode = "create",
  defaultValues,
  initialImageUrl = null,
}: CustomerProfileFormProps) => {
  const copy = COPY[mode];

  const {
    control,
    handleSubmit,
    formState: { errors, isValid, isSubmitting },
  } = useForm<CustomerProfileFormValues>({
    resolver: zodResolver(customerProfileSchema),
    mode: "onChange",
    defaultValues: {
      imageFile: null,
      serviceTypes: [],
      regionId: null,
      ...defaultValues,
    },
  });

  const onSubmit = handleSubmit((values) => {
    // Phase A: API 연동 전 — 제출 값 확인용
    console.log("[CustomerProfileForm]", mode, values);
  });

  return (
    <form
      className="px-margin-mobile mx-auto flex w-full max-w-[640px] flex-col gap-40 py-32 md:px-72 md:py-40 lg:px-0 lg:pt-56 lg:pb-70"
      onSubmit={onSubmit}
      noValidate
    >
      <ProfilePageHeader title={copy.title} description={copy.description} />

      <div className="flex w-full flex-col gap-32">
        <section className="flex w-full flex-col gap-32">
          <div className="flex flex-col gap-16 md:gap-20">
            <ProfileFieldHeader label="프로필 이미지" htmlFor="customer-profile-image" />
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
          <div className="border-border-subtle w-full border-b" aria-hidden="true" />
        </section>

        <section className="flex w-full flex-col gap-32">
          <div className="flex flex-col gap-16 md:gap-24">
            <ProfileFieldHeader
              label="이용 서비스"
              hint="*이용 서비스는 중복 선택 가능하며, 언제든 수정 가능해요!"
            />
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
          <div className="border-border-subtle w-full border-b" aria-hidden="true" />
        </section>

        <section className="flex w-full flex-col gap-16 md:gap-24">
          <ProfileFieldHeader
            label="내가 사는 지역"
            hint="*내가 사는 지역은 언제든 수정 가능해요!"
          />
          <Controller
            name="regionId"
            control={control}
            render={({ field }) => (
              <ProfileChipGroup<RegionId>
                selectionMode="single"
                options={REGION_OPTIONS}
                value={field.value ?? null}
                onChange={field.onChange}
                error={errors.regionId?.message}
                className="max-w-[277px] gap-x-8 gap-y-12 md:max-w-none"
              />
            )}
          />
        </section>
      </div>

      <Button
        type="submit"
        variant="solid"
        size="auth"
        fullWidth
        disabled={!isValid || isSubmitting}
      >
        {copy.submitLabel}
      </Button>
    </form>
  );
};

export default CustomerProfileForm;
