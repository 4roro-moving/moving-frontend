"use client";

import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
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

type FocusField = "phone" | "nickname";

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

  const submissionInFlightRef = useRef(false);
  const pendingFocusFieldRef = useRef<FocusField | null>(null);
  const focusTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const [submitError, setSubmitError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const isPending = isSubmitting || createMoverProfile.isPending;

  useEffect(() => {
    return () => {
      if (focusTimeoutRef.current !== null) {
        clearTimeout(focusTimeoutRef.current);
      }
    };
  }, []);

  const submit = async (formValues: MoverProfileFormValues) => {
    if (focusTimeoutRef.current !== null) {
      clearTimeout(focusTimeoutRef.current);
      focusTimeoutRef.current = null;
    }

    if (submissionInFlightRef.current || isPending) {
      return;
    }

    submissionInFlightRef.current = true;
    pendingFocusFieldRef.current = null;

    setSubmitError(null);
    setIsSubmitting(true);

    let shouldKeepPending = false;

    try {
      const imageKey = await uploadProfileImage(formValues.imageFile);
      const activityBaseAddress = formValues.activityBaseAddress;

      if (!activityBaseAddress) {
        setError("activityBaseAddress", {
          type: "required",
          message: "활동 거점을 선택해 주세요",
        });
        return;
      }

      await createMoverProfile.mutateAsync({
        ...(requiresPhone && formValues.phone ? { phone: formValues.phone } : {}),
        nickname: formValues.nickname,
        career: Number(formValues.career),
        shortIntro: formValues.shortIntro,
        description: formValues.description,
        activityBase: {
          address: activityBaseAddress.roadAddress,
          ...(formValues.activityBaseDetailAddress
            ? { detailAddress: formValues.activityBaseDetailAddress }
            : {}),
          zipCode: activityBaseAddress.zipCode,
          latitude: activityBaseAddress.latitude,
          longitude: activityBaseAddress.longitude,
        },
        regionIds: formValues.regionIds,
        serviceTypes: formValues.serviceTypes,
        ...(imageKey ? { imageUrl: imageKey } : {}),
      });

      router.replace(getRoleHomePath("MOVER"));
      shouldKeepPending = true;
    } catch (error) {
      if (isConflictError(error)) {
        if (error.message.includes(MOVER_PROFILE_PHONE_ERROR_KEYWORD)) {
          setError("phone", {
            type: "server",
            message: error.message,
          });
          pendingFocusFieldRef.current = "phone";
          return;
        }

        if (hasNicknameErrorKeyword(error.message)) {
          setError("nickname", {
            type: "server",
            message: error.message,
          });
          pendingFocusFieldRef.current = "nickname";
          return;
        }
      }

      setSubmitError(getApiErrorMessage(error, MOVER_PROFILE_CREATE_ERROR_MESSAGE));
    } finally {
      if (!shouldKeepPending) {
        submissionInFlightRef.current = false;
        setIsSubmitting(false);
      }

      const focusField = pendingFocusFieldRef.current;

      if (focusField) {
        pendingFocusFieldRef.current = null;

        focusTimeoutRef.current = setTimeout(() => {
          focusTimeoutRef.current = null;
          setFocus(focusField);
        }, 0);
      }
    }
  };

  return {
    submitError,
    isPending,
    submit,
  };
}
