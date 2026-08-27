"use client";

import { useState } from "react";
import type {
  FieldNamesMarkedBoolean,
  UseFormReset,
  UseFormResetField,
  UseFormSetError,
  UseFormSetFocus,
} from "react-hook-form";

import { useUpdateCustomerBasicInfo } from "@/hooks/profile/useUpdateCustomerBasicInfo";
import { useUpdateCustomerProfile } from "@/hooks/profile/useUpdateCustomerProfile";
import { getApiErrorMessage } from "@/lib/api/getApiErrorMessage";
import { reauthAfterPasswordChange } from "@/lib/auth/reauthAfterPasswordChange";
import { APP_ROUTES } from "@/lib/constants/appRoutes";
import { ERROR_CODES } from "@/lib/constants/errorCodes";
import {
  CUSTOMER_PROFILE_CURRENT_PASSWORD_ERROR_KEYWORD,
  CUSTOMER_PROFILE_PHONE_ERROR_KEYWORD,
} from "@/lib/constants/profileMessages";
import { buildCustomerProfileEditPayloads } from "@/lib/profile/buildCustomerProfileEditPayloads";
import { uploadProfileImage } from "@/lib/profile/uploadProfileImage";
import type { CustomerProfileEditFormValues } from "@/lib/schemas/customerProfileEditSchema";
import { hasPasswordChangePayload } from "@/lib/schemas/passwordChangeFields";
import { ApiError } from "@/types/api";

interface UseCustomerProfileEditFormParams {
  hasPassword: boolean;
  messages: CustomerProfileEditMessages;
  reset: UseFormReset<CustomerProfileEditFormValues>;
  resetField: UseFormResetField<CustomerProfileEditFormValues>;
  setError: UseFormSetError<CustomerProfileEditFormValues>;
  setFocus: UseFormSetFocus<CustomerProfileEditFormValues>;
}

export interface CustomerProfileEditMessages {
  noChanges: string;
  partialSaveFailed: string;
  saveSuccess: string;
  saveFailed: string;
}

type CustomerProfileDirtyFields = Partial<
  Readonly<FieldNamesMarkedBoolean<CustomerProfileEditFormValues>>
>;

function isConflictError(error: unknown): error is ApiError {
  return (
    error instanceof ApiError &&
    (error.status === ERROR_CODES.CONFLICT.status || error.code === ERROR_CODES.CONFLICT.code)
  );
}

function isUnauthorizedError(error: unknown): error is ApiError {
  return (
    error instanceof ApiError &&
    (error.status === ERROR_CODES.UNAUTHORIZED.status ||
      error.code === ERROR_CODES.UNAUTHORIZED.code)
  );
}

export function useCustomerProfileEditForm({
  hasPassword,
  messages,
  reset,
  resetField,
  setError,
  setFocus,
}: UseCustomerProfileEditFormParams) {
  const updateCustomerBasicInfo = useUpdateCustomerBasicInfo();
  const updateCustomerProfile = useUpdateCustomerProfile();

  const [submitError, setSubmitError] = useState<string | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const isPending =
    isSubmitting || updateCustomerBasicInfo.isPending || updateCustomerProfile.isPending;

  const submit = async (
    formValues: CustomerProfileEditFormValues,
    dirtyFields: CustomerProfileDirtyFields,
  ) => {
    if (isPending) {
      return;
    }

    setSubmitError(null);
    setIsSubmitting(true);

    try {
      const imageKey = await uploadProfileImage(formValues.imageFile);

      const { basic, profile } = buildCustomerProfileEditPayloads({
        formValues,
        dirtyFields,
        hasPassword,
        uploadedImageUrl: imageKey,
      });

      if (!basic && !profile) {
        setSubmitError(messages.noChanges);
        return;
      }

      const didChangePassword = hasPasswordChangePayload(basic);
      let didBasicSucceed = false;

      if (basic) {
        await updateCustomerBasicInfo.mutateAsync(basic);
        didBasicSucceed = true;

        resetField("name", { defaultValue: formValues.name });
        resetField("phone", { defaultValue: formValues.phone });
        resetField("currentPassword", { defaultValue: "" });
        resetField("newPassword", { defaultValue: "" });
        resetField("newPasswordConfirm", { defaultValue: "" });
      }

      if (profile) {
        try {
          await updateCustomerProfile.mutateAsync(profile);
        } catch (profileError) {
          if (didBasicSucceed && didChangePassword) {
            await reauthAfterPasswordChange(APP_ROUTES.LOGIN, {
              profileFailed: true,
            });
            return;
          }

          if (didBasicSucceed) {
            setSubmitError(messages.partialSaveFailed);
            return;
          }

          throw profileError;
        }
      }

      if (didChangePassword) {
        await reauthAfterPasswordChange(APP_ROUTES.LOGIN);
        return;
      }

      reset({
        ...formValues,
        imageFile: null,
        shouldRemoveImage: false,
        currentPassword: "",
        newPassword: "",
        newPasswordConfirm: "",
      });

      setToastMessage(messages.saveSuccess);
    } catch (error) {
      if (isConflictError(error) && error.message.includes(CUSTOMER_PROFILE_PHONE_ERROR_KEYWORD)) {
        setError("phone", {
          type: "server",
          message: error.message,
        });
        setFocus("phone");
        return;
      }

      if (
        isUnauthorizedError(error) &&
        error.message.includes(CUSTOMER_PROFILE_CURRENT_PASSWORD_ERROR_KEYWORD)
      ) {
        setError("currentPassword", {
          type: "server",
          message: error.message,
        });
        setFocus("currentPassword");
        return;
      }

      setSubmitError(getApiErrorMessage(error, messages.saveFailed));
    } finally {
      setIsSubmitting(false);
    }
  };

  return {
    submitError,
    toastMessage,
    isPending,
    setToastMessage,
    submit,
  };
}
