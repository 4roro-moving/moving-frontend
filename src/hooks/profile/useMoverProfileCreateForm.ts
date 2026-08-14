"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import type { UseFormSetError, UseFormSetFocus } from "react-hook-form";

import { useCreateMoverProfile } from "@/hooks/profile/useCreateMoverProfile";
import { getApiErrorMessage } from "@/lib/api/getApiErrorMessage";
import { getRoleHomePath } from "@/lib/auth/redirect";
import { ERROR_CODES } from "@/lib/constants/errorCodes";
import {
  MOVER_PROFILE_CREATE_ERROR_MESSAGE,
  MOVER_PROFILE_NICKNAME_ERROR_KEYWORDS,
  MOVER_PROFILE_PHONE_ERROR_KEYWORD,
} from "@/lib/constants/profileMessages";
import { uploadProfileImage } from "@/lib/profile/uploadProfileImage";
import type { MoverProfileFormValues } from "@/lib/schemas/moverProfileSchema";
import { ApiError } from "@/types/api";

interface UseMoverProfileCreateFormParams {
  requiresPhone: boolean;
  setError: UseFormSetError<MoverProfileFormValues>;
  setFocus: UseFormSetFocus<MoverProfileFormValues>;
}

function isConflictError(error: unknown): error is ApiError {
  return (
    error instanceof ApiError &&
    (error.status === ERROR_CODES.CONFLICT.status || error.code === ERROR_CODES.CONFLICT.code)
  );
}

function hasNicknameErrorKeyword(message: string): boolean {
  return MOVER_PROFILE_NICKNAME_ERROR_KEYWORDS.some((keyword) => message.includes(keyword));
}

export function useMoverProfileCreateForm({
  requiresPhone,
  setError,
  setFocus,
}: UseMoverProfileCreateFormParams) {
  const router = useRouter();
  const createMoverProfile = useCreateMoverProfile();

  const [submitError, setSubmitError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const isPending = isSubmitting || createMoverProfile.isPending;

  const submit = async (formValues: MoverProfileFormValues) => {
    if (isPending) {
      return;
    }

    setSubmitError(null);
    setIsSubmitting(true);

    try {
      const imageKey = await uploadProfileImage(formValues.imageFile);

      await createMoverProfile.mutateAsync({
        ...(requiresPhone && formValues.phone ? { phone: formValues.phone } : {}),
        nickname: formValues.nickname,
        career: Number(formValues.career),
        shortIntro: formValues.shortIntro,
        description: formValues.description,
        regionIds: formValues.regionIds,
        serviceTypes: formValues.serviceTypes,
        ...(imageKey ? { imageUrl: imageKey } : {}),
      });

      router.replace(getRoleHomePath("MOVER"));
    } catch (error) {
      if (isConflictError(error)) {
        if (error.message.includes(MOVER_PROFILE_PHONE_ERROR_KEYWORD)) {
          setError("phone", {
            type: "server",
            message: error.message,
          });
          setFocus("phone");
          return;
        }

        if (hasNicknameErrorKeyword(error.message)) {
          setError("nickname", {
            type: "server",
            message: error.message,
          });
          setFocus("nickname");
          return;
        }
      }

      setSubmitError(getApiErrorMessage(error, MOVER_PROFILE_CREATE_ERROR_MESSAGE));
    } finally {
      setIsSubmitting(false);
    }
  };

  return {
    submitError,
    isPending,
    submit,
  };
}
