"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Controller, useForm } from "react-hook-form";

import Button from "@/components/common/Button/Button";
import FormField from "@/components/common/FormField/FormField";
import Input from "@/components/common/Input/Input";
import { Text } from "@/components/common/Text";
import ProfileChipGroup from "@/components/profile/ProfileChipGroup";
import ProfileImageUploader from "@/components/profile/ProfileImageUploader";
import ProfilePageHeader from "@/components/profile/ProfilePageHeader";
import { useCreateCustomerProfile } from "@/hooks/profile/useCreateCustomerProfile";
import { getApiErrorMessage } from "@/lib/api/getApiErrorMessage";
import { getRoleHomePath } from "@/lib/auth/redirect";
import { MOVE_TYPE_OPTIONS } from "@/lib/constants/moveType";
import { REGION_OPTIONS, type RegionId } from "@/lib/constants/region";
import { uploadProfileImage } from "@/lib/profile/uploadProfileImage";
import {
  createCustomerProfileSchema,
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
    resolver: zodResolver(createCustomerProfileSchema({ requiresPhone })),
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
        setSubmitError("내가 사는 지역을 선택해 주세요");
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

      setSubmitError(getApiErrorMessage(error, "프로필 저장에 실패했습니다."));
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
      <ProfilePageHeader
        title="프로필 등록"
        description="추가 정보를 입력하여 회원가입을 완료해주세요."
      />

      <div className="flex w-full flex-col gap-32">
        {requiresPhone ? (
          <FormField label="전화번호" labelFor="customer-create-phone" required>
            <Input
              id="customer-create-phone"
              size="md"
              inputMode="numeric"
              numericOnly
              stripLeadingZeros={false}
              placeholder="전화번호를 입력해 주세요"
              error={errors.phone?.message}
              {...register("phone")}
            />
          </FormField>
        ) : null}

        <section className="flex w-full flex-col gap-32">
          <FormField label="프로필 이미지" labelFor="customer-profile-image">
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
                />
              )}
            />
          </FormField>
          <div className="border-border-subtle w-full border-b" aria-hidden="true" />
        </section>

        <section className="flex w-full flex-col gap-32">
          <FormField
            label="이용 서비스"
            labelId="customer-create-service-types-label"
            description="*이용 서비스는 중복 선택 가능하며, 언제든 수정 가능해요!"
          >
            <Controller
              name="serviceTypes"
              control={control}
              render={({ field }) => (
                <ProfileChipGroup<MoveType>
                  aria-labelledby="customer-create-service-types-label"
                  selectionMode="multiple"
                  options={MOVE_TYPE_OPTIONS}
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
          label="내가 사는 지역"
          labelId="customer-create-region-label"
          description="*내가 사는 지역은 언제든 수정 가능해요!"
        >
          <Controller
            name="regionId"
            control={control}
            render={({ field }) => (
              <ProfileChipGroup<RegionId>
                aria-labelledby="customer-create-region-label"
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

      {submitError ? (
        <Text as="p" role="alert" variant="md-medium" className="text-text-error text-center">
          {submitError}
        </Text>
      ) : null}

      <Button type="submit" variant="solid" size="auth" fullWidth disabled={!isValid || isPending}>
        시작하기
      </Button>
    </form>
  );
};

export default CustomerProfileForm;
