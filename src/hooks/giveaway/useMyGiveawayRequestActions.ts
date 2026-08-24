"use client";

import { useState } from "react";

import { useCancelGiveawayRequest } from "@/hooks/giveaway/useCancelGiveawayRequest";
import { getApiErrorMessage } from "@/lib/api/getApiErrorMessage";
import {
  GIVEAWAY_REQUEST_CANCEL_ERROR_MESSAGE,
  GIVEAWAY_REQUEST_CANCEL_SUCCESS_MESSAGE,
  GIVEAWAY_REQUEST_EDIT_SUCCESS_MESSAGE,
} from "@/lib/constants/giveaway";
import type { MyGiveawayRequestItem } from "@/types/giveaway";

export const useMyGiveawayRequestActions = () => {
  const cancelMutation = useCancelGiveawayRequest();
  const [requestToEdit, setRequestToEdit] = useState<MyGiveawayRequestItem | null>(null);
  const [requestToCancel, setRequestToCancel] = useState<MyGiveawayRequestItem | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const closeEdit = () => {
    setRequestToEdit(null);
  };

  const closeCancel = () => {
    if (cancelMutation.isPending) {
      return;
    }

    setRequestToCancel(null);
  };

  const confirmCancel = () => {
    if (!requestToCancel) {
      return;
    }

    cancelMutation.mutate(requestToCancel.id, {
      onSuccess: () => {
        setRequestToCancel(null);
        setToastMessage(GIVEAWAY_REQUEST_CANCEL_SUCCESS_MESSAGE);
      },
      onError: (error) => {
        setToastMessage(getApiErrorMessage(error, GIVEAWAY_REQUEST_CANCEL_ERROR_MESSAGE));
      },
    });
  };

  const handleEditSuccess = () => {
    setToastMessage(GIVEAWAY_REQUEST_EDIT_SUCCESS_MESSAGE);
  };

  const closeToast = () => {
    setToastMessage(null);
  };

  return {
    requestToEdit,
    requestToCancel,
    toastMessage,
    isCancelPending: cancelMutation.isPending,
    openEdit: setRequestToEdit,
    openCancel: setRequestToCancel,
    closeEdit,
    closeCancel,
    confirmCancel,
    handleEditSuccess,
    closeToast,
  };
};

export type MyGiveawayRequestActions = ReturnType<typeof useMyGiveawayRequestActions>;
