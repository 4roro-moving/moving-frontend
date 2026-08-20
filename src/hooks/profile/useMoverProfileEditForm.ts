"use client";

import { useEffect, useRef, useState } from "react";
import type { UseFormReset, UseFormSetError, UseFormSetFocus } from "react-hook-form";

import { useUpdateMoverProfile } from "@/hooks/profile/useUpdateMoverProfile";
import { getApiErrorMessage } from "@/lib/api/getApiErrorMessage";
import { ERROR_CODES } from "@/lib/constants/errorCodes";
import {
  MOVER_PROFILE_EDIT_ERROR_MESSAGE,
  MOVER_PROFILE_EDIT_SUCCESS_MESSAGE,
  MOVER_PROFILE_NICKNAME_ERROR_KEYWORDS,
} from "@/lib/constants/profileMessages";
import { uploadProfileImage } from "@/lib/profile/uploadProfileImage";
import type { MoverProfileFormValues } from "@/lib/schemas/moverProfileSchema";
import { ApiError } from "@/types/api";

interface UseMoverProfileEditFormParams {
  reset: UseFormReset<MoverProfileFormValues>;
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

export function useMoverProfileEditForm({
  reset,
  setError,
  setFocus,
}: UseMoverProfileEditFormParams) {
  const updateMoverProfile = useUpdateMoverProfile();

  const submissionInFlightRef = useRef(false);
  const shouldFocusNicknameRef = useRef(false);
  const nicknameFocusTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const [submitError, setSubmitError] = useState<string | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const isPending = isSubmitting || updateMoverProfile.isPending;

  useEffect(() => {
    return () => {
      if (nicknameFocusTimeoutRef.current !== null) {
        clearTimeout(nicknameFocusTimeoutRef.current);
      }
    };
  }, []);

  const submit = async (formValues: MoverProfileFormValues) => {
    if (nicknameFocusTimeoutRef.current !== null) {
      clearTimeout(nicknameFocusTimeoutRef.current);
      nicknameFocusTimeoutRef.current = null;
    }

    if (submissionInFlightRef.current || isPending) {
      return;
    }

    submissionInFlightRef.current = true;
    shouldFocusNicknameRef.current = false;

    setSubmitError(null);
    setIsSubmitting(true);

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

      await updateMoverProfile.mutateAsync({
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

      reset({
        ...formValues,
        imageFile: null,
      });

      setToastMessage(MOVER_PROFILE_EDIT_SUCCESS_MESSAGE);
    } catch (error) {
      if (isConflictError(error) && hasNicknameErrorKeyword(error.message)) {
        setError("nickname", {
          type: "server",
          message: error.message,
        });
        shouldFocusNicknameRef.current = true;
        return;
      }

      setSubmitError(getApiErrorMessage(error, MOVER_PROFILE_EDIT_ERROR_MESSAGE));
    } finally {
      submissionInFlightRef.current = false;
      setIsSubmitting(false);

      if (shouldFocusNicknameRef.current) {
        shouldFocusNicknameRef.current = false;

        nicknameFocusTimeoutRef.current = setTimeout(() => {
          nicknameFocusTimeoutRef.current = null;
          setFocus("nickname");
        }, 0);
      }
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
