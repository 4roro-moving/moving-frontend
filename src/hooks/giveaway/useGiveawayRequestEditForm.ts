"use client";

import { useState } from "react";

import { useUpdateGiveawayRequest } from "@/hooks/giveaway/useUpdateGiveawayRequest";
import { getApiErrorMessage } from "@/lib/api/getApiErrorMessage";
import { GIVEAWAY_REQUEST_MESSAGE_MAX_LENGTH } from "@/lib/constants/giveaway";
import type { MyGiveawayRequestItem } from "@/types/giveaway";

interface UseGiveawayRequestEditFormParams {
  request: MyGiveawayRequestItem;
  onClose: () => void;
  onSuccess?: () => void;
}

const getMessageError = (value: string): string | undefined => {
  if (value.length > GIVEAWAY_REQUEST_MESSAGE_MAX_LENGTH) {
    return `신청 내용은 ${String(GIVEAWAY_REQUEST_MESSAGE_MAX_LENGTH)}자 이하여야 합니다.`;
  }

  return undefined;
};

export const useGiveawayRequestEditForm = ({
  request,
  onClose,
  onSuccess,
}: UseGiveawayRequestEditFormParams) => {
  const initialMessage = request.message ?? "";
  const [message, setMessage] = useState(initialMessage);
  const [isTouched, setIsTouched] = useState(false);
  const [submitError, setSubmitError] = useState<string | undefined>();
  const updateMutation = useUpdateGiveawayRequest();

  const resetForm = () => {
    setMessage(initialMessage);
    setIsTouched(false);
    setSubmitError(undefined);
  };

  const trimmedMessage = message.trim();
  const messageError = isTouched ? getMessageError(message) : undefined;
  const isValid = !getMessageError(message);
  const hasChanges = trimmedMessage !== initialMessage.trim();
  const isSubmitting = updateMutation.isPending;
  const isSubmitDisabled = isSubmitting || !isValid || !hasChanges;

  const handleClose = () => {
    if (isSubmitting) {
      return;
    }
    resetForm();
    onClose();
  };

  const handleSubmit = () => {
    if (isSubmitDisabled) {
      return;
    }

    setSubmitError(undefined);
    updateMutation.mutate(
      {
        requestId: request.id,
        body: { message: trimmedMessage || null },
      },
      {
        onSuccess: () => {
          onSuccess?.();
          onClose();
        },
        onError: (error) => {
          setSubmitError(getApiErrorMessage(error, "신청 내용을 수정하지 못했습니다."));
        },
      },
    );
  };

  return {
    message,
    messageError,
    submitError,
    isSubmitting,
    isSubmitDisabled,
    handleClose,
    handleSubmit,
    handleMessageChange: (value: string) => {
      setMessage(value);
      setSubmitError(undefined);
    },
    handleMessageBlur: () => setIsTouched(true),
  };
};
