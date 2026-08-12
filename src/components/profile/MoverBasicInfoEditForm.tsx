"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { useForm } from "react-hook-form";

import FormField from "@/components/common/FormField/FormField";
import Input from "@/components/common/Input/Input";
import PasswordInput from "@/components/common/Input/PasswordInput";
import { Text } from "@/components/common/Text";
import Toast from "@/components/common/Toast/Toast";
import ProfileFormActions from "@/components/profile/ProfileFormActions";
import ProfilePageHeader from "@/components/profile/ProfilePageHeader";
import { useUpdateMoverBasicInfo } from "@/hooks/profile/useUpdateMoverBasicInfo";
import { getApiErrorMessage } from "@/lib/api/getApiErrorMessage";
import { markPasswordChangedToast } from "@/lib/auth/passwordChangedToast";
import { APP_ROUTES } from "@/lib/constants/appRoutes";
import {
  moverBasicInfoEditSchema,
  type MoverBasicInfoEditFormValues,
} from "@/lib/schemas/moverBasicInfoEditSchema";
import { toPasswordChangePayload } from "@/lib/schemas/passwordChangeFields";
import { cn } from "@/lib/utils/cn";
import { preventEnterSubmitOnInput } from "@/lib/utils/preventEnterSubmitOnInput";
import { useAuthStore } from "@/stores/useAuthStore";
import { ApiError } from "@/types/api";

interface MoverBasicInfoEditFormProps {
  email: string;
  hasPassword: boolean;
  defaultValues?: Partial<MoverBasicInfoEditFormValues>;
}

const MoverBasicInfoEditForm = ({
  email,
  hasPassword,
  defaultValues,
}: MoverBasicInfoEditFormProps) => {
  const updateMoverBasicInfo = useUpdateMoverBasicInfo();
  const logout = useAuthStore((state) => state.logout);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    setError,
    setFocus,
    getValues,
    reset,
    formState: { errors, isValid, isSubmitting, isDirty },
  } = useForm<MoverBasicInfoEditFormValues>({
    resolver: zodResolver(moverBasicInfoEditSchema),
    mode: "onChange",
    defaultValues: {
      name: "",
      phone: "",
      currentPassword: "",
      newPassword: "",
      newPasswordConfirm: "",
      ...defaultValues,
    },
  });

  const isPending = isSubmitting || updateMoverBasicInfo.isPending;

  const onSubmit = handleSubmit(async (formValues) => {
    setSubmitError(null);

    try {
      const passwordPayload = hasPassword ? toPasswordChangePayload(formValues) : {};
      const didChangePassword = Object.keys(passwordPayload).length > 0;

      await updateMoverBasicInfo.mutateAsync({
        name: formValues.name,
        phone: formValues.phone,
        ...passwordPayload,
      });

      if (didChangePassword) {
        markPasswordChangedToast();
        try {
          await logout({ deferUiClear: true });
        } catch {
          // refresh 폐기 후 logout API 실패해도 로컬 세션은 정리됨
        }
        window.location.assign(APP_ROUTES.MOVER_LOGIN);
        return;
      }

      const current = getValues();
      reset({
        ...current,
        currentPassword: "",
        newPassword: "",
        newPasswordConfirm: "",
      });
      setToastMessage("기본정보가 수정되었습니다.");
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
        setFocus("phone");
        return;
      }

      if (
        error instanceof ApiError &&
        (error.status === 401 || error.code === "UNAUTHORIZED") &&
        error.message.includes("현재 비밀번호")
      ) {
        setError("currentPassword", {
          type: "server",
          message: error.message,
        });
        setFocus("currentPassword");
        return;
      }

      setSubmitError(getApiErrorMessage(error, "기본정보 수정에 실패했습니다."));
    }
  });

  return (
    <form
      className="px-margin-mobile mx-auto flex w-full max-w-[1120px] flex-col gap-40 py-32 md:gap-48 md:px-72 md:py-40 lg:px-0 lg:pt-56 lg:pb-70"
      onSubmit={onSubmit}
      onKeyDown={preventEnterSubmitOnInput}
      noValidate
      autoComplete="off"
    >
      <ProfilePageHeader title="기본정보 수정" />

      <div
        className={cn(
          "flex w-full flex-col gap-32",
          hasPassword
            ? "lg:flex-row lg:items-start lg:justify-between lg:gap-[120px]"
            : "items-center",
        )}
      >
        <div
          className={cn(
            "flex w-full flex-col gap-32",
            hasPassword ? "lg:w-[500px]" : "max-w-[500px]",
          )}
        >
          <FormField label="이름" labelFor="mover-basic-name" required>
            <Input
              id="mover-basic-name"
              size="md"
              placeholder="성함을 입력해 주세요"
              error={errors.name?.message}
              maxLength={50}
              {...register("name")}
            />
          </FormField>

          <FormField label="이메일" labelFor="mover-basic-email">
            <Input id="mover-basic-email" size="md" type="email" value={email} disabled readOnly />
          </FormField>

          <FormField label="전화번호" labelFor="mover-basic-phone" required>
            <Input id="mover-basic-phone" size="md" readOnly disabled {...register("phone")} />
          </FormField>
        </div>

        {hasPassword ? (
          <div className="flex w-full flex-col gap-32 lg:w-[500px]">
            <FormField label="현재 비밀번호" labelFor="mover-basic-current-password">
              <PasswordInput
                id="mover-basic-current-password"
                size="md"
                autoComplete="current-password"
                placeholder="현재 비밀번호를 입력해 주세요"
                error={errors.currentPassword?.message}
                {...register("currentPassword")}
              />
            </FormField>

            <FormField label="새 비밀번호" labelFor="mover-basic-new-password">
              <PasswordInput
                id="mover-basic-new-password"
                size="md"
                autoComplete="new-password"
                placeholder="새 비밀번호를 입력해 주세요"
                error={errors.newPassword?.message}
                {...register("newPassword")}
              />
            </FormField>

            <FormField label="새 비밀번호 확인" labelFor="mover-basic-new-password-confirm">
              <PasswordInput
                id="mover-basic-new-password-confirm"
                size="md"
                autoComplete="new-password"
                placeholder="새 비밀번호를 다시 입력해 주세요"
                error={errors.newPasswordConfirm?.message}
                {...register("newPasswordConfirm")}
              />
            </FormField>
          </div>
        ) : null}
      </div>

      {submitError ? (
        <Text as="p" role="alert" variant="md-medium" className="text-text-error text-center">
          {submitError}
        </Text>
      ) : null}

      <ProfileFormActions
        isSubmitDisabled={!isValid || isPending || !isDirty}
        className={hasPassword ? undefined : "md:justify-center"}
      />

      {toastMessage ? <Toast onClose={() => setToastMessage(null)}>{toastMessage}</Toast> : null}
    </form>
  );
};

export default MoverBasicInfoEditForm;
