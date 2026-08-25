"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useTranslations } from "next-intl";
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
import { reauthAfterPasswordChange } from "@/lib/auth/reauthAfterPasswordChange";
import { APP_ROUTES } from "@/lib/constants/appRoutes";
import {
  createMoverBasicInfoEditSchema,
  type MoverBasicInfoValidationMessages,
  type MoverBasicInfoEditFormValues,
} from "@/lib/schemas/moverBasicInfoEditSchema";
import {
  hasPasswordChangePayload,
  toPasswordChangePayload,
} from "@/lib/schemas/passwordChangeFields";
import { cn } from "@/lib/utils/cn";
import { preventEnterSubmitOnInput } from "@/lib/utils/preventEnterSubmitOnInput";
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
  const t = useTranslations("profile");
  const updateMoverBasicInfo = useUpdateMoverBasicInfo();
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    setError,
    setFocus,
    reset,
    formState: { errors, isValid, isSubmitting, isDirty },
  } = useForm<MoverBasicInfoEditFormValues>({
    resolver: zodResolver(
      createMoverBasicInfoEditSchema({
        nameRequired: t("validation.nameRequired"),
        nameMax: t("validation.nameMax", { max: 50 }),
        phoneRequired: t("validation.phoneRequired"),
        phoneInvalid: t("validation.phoneInvalid"),
        currentPasswordRequired: t("validation.currentPasswordRequired"),
        newPasswordRequired: t("validation.newPasswordRequired"),
        newPasswordMin: t("validation.newPasswordMin"),
        newPasswordConfirmRequired: t("validation.newPasswordConfirmRequired"),
        newPasswordMismatch: t("validation.newPasswordMismatch"),
      } satisfies MoverBasicInfoValidationMessages),
    ),
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
      const didChangePassword = hasPasswordChangePayload(passwordPayload);

      await updateMoverBasicInfo.mutateAsync({
        name: formValues.name,
        phone: formValues.phone,
        ...passwordPayload,
      });

      if (didChangePassword) {
        await reauthAfterPasswordChange(APP_ROUTES.MOVER_LOGIN);
        return;
      }

      reset({
        ...formValues,
        currentPassword: "",
        newPassword: "",
        newPasswordConfirm: "",
      });
      setToastMessage(t("basicInfoSaveSuccess"));
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

      setSubmitError(getApiErrorMessage(error, t("basicInfoSaveFailed")));
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
      <ProfilePageHeader title={t("basicInfoTitle")} />

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
          <FormField
            label={t("name")}
            labelFor="mover-basic-name"
            required
            requiredLabel={t("requiredField")}
          >
            <Input
              id="mover-basic-name"
              size="md"
              placeholder={t("namePlaceholder")}
              error={errors.name?.message}
              maxLength={50}
              disabled={isPending}
              {...register("name")}
            />
          </FormField>

          <FormField label={t("email")} labelFor="mover-basic-email">
            <Input id="mover-basic-email" size="md" type="email" value={email} disabled readOnly />
          </FormField>

          <FormField
            label={t("phone")}
            labelFor="mover-basic-phone"
            required
            requiredLabel={t("requiredField")}
          >
            <Input id="mover-basic-phone" size="md" readOnly disabled {...register("phone")} />
          </FormField>
        </div>

        {hasPassword ? (
          <div className="flex w-full flex-col gap-32 lg:w-[500px]">
            <FormField label={t("currentPassword")} labelFor="mover-basic-current-password">
              <PasswordInput
                id="mover-basic-current-password"
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

            <FormField label={t("newPassword")} labelFor="mover-basic-new-password">
              <PasswordInput
                id="mover-basic-new-password"
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

            <FormField label={t("newPasswordConfirm")} labelFor="mover-basic-new-password-confirm">
              <PasswordInput
                id="mover-basic-new-password-confirm"
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
