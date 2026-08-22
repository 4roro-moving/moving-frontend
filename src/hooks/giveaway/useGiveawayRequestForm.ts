"use client";

import { useState } from "react";

import { useCreateGiveawayRequest } from "@/hooks/giveaway/useCreateGiveawayRequest";
import { useUpdateGiveawayRequest } from "@/hooks/giveaway/useUpdateGiveawayRequest";
import { getApiErrorMessage } from "@/lib/api/getApiErrorMessage";
import { GIVEAWAY_REQUEST_MESSAGE_MAX_LENGTH } from "@/lib/constants/giveaway";

interface GiveawayRequestFormValues {
  id: number;
  message: string | null;
}

interface UseGiveawayRequestFormParams {
  mode: "create" | "edit";
  giveawayId: number;
  request?: GiveawayRequestFormValues;
  onClose: () => void;
  onSuccess?: () => void;
}

const getMessageError = (value: string): string | undefined => {
  if (value.length > GIVEAWAY_REQUEST_MESSAGE_MAX_LENGTH) {
    return `신청 내용은 ${String(GIVEAWAY_REQUEST_MESSAGE_MAX_LENGTH)}자 이하여야 합니다.`;
  }

  return undefined;
};

export const useGiveawayRequestForm = ({
  mode,
  giveawayId,
  request,
  onClose,
  onSuccess,
}: UseGiveawayRequestFormParams) => {
  const initialMessage = request?.message ?? "";
  const [message, setMessage] = useState(initialMessage);
  const [isTouched, setIsTouched] = useState(false);
  const [submitError, setSubmitError] = useState<string | undefined>();
  const createMutation = useCreateGiveawayRequest();
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
  const isSubmitting = mode === "create" ? createMutation.isPending : updateMutation.isPending;
  const isSubmitDisabled =
    isSubmitting || !isValid || (mode === "edit" && (!hasChanges || request === undefined));

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

    if (mode === "create") {
      createMutation.mutate(
        {
          giveawayId,
          body: trimmedMessage ? { message: trimmedMessage } : {},
        },
        {
          onSuccess: () => {
            onSuccess?.();
            onClose();
          },
          onError: (error) => {
            setSubmitError(getApiErrorMessage(error, "나눔을 신청하지 못했습니다."));
          },
        },
      );
      return;
    }

    if (request === undefined) {
      return;
    }

    updateMutation.mutate(
      {
        requestId: request.id,
        giveawayId,
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
