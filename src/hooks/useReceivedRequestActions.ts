"use client";

import { useTranslations } from "next-intl";

import { useState } from "react";

import { useRejectMoverEstimate, useSendMoverEstimate } from "@/hooks/useMoverEstimateRequests";
import type { MoverEstimateRequest, SendEstimateInput } from "@/types/moverEstimateRequest";

export function useReceivedRequestActions() {
  const t = useTranslations("estimates");
  const [selectedRequest, setSelectedRequest] = useState<MoverEstimateRequest | null>(null);
  const [isSendOpen, setIsSendOpen] = useState(false);

  const [requestToReject, setRequestToReject] = useState<MoverEstimateRequest | null>(null);
  const [isRejectOpen, setIsRejectOpen] = useState(false);

  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const sendEstimateMutation = useSendMoverEstimate();
  const rejectEstimateMutation = useRejectMoverEstimate();

  const openSendModal = (request: MoverEstimateRequest) => {
    setSelectedRequest(request);
    setIsSendOpen(true);
  };

  const closeSendModal = () => {
    setIsSendOpen(false);
  };

  const clearSelectedRequest = () => {
    setSelectedRequest(null);
  };

  const openRejectModal = (request: MoverEstimateRequest) => {
    setRequestToReject(request);
    setIsRejectOpen(true);
  };

  const closeRejectModal = () => {
    setIsRejectOpen(false);
  };

  const clearRequestToReject = () => {
    setRequestToReject(null);
  };

  const sendEstimate = (input: SendEstimateInput) => {
    if (!selectedRequest) return;

    sendEstimateMutation.mutate(
      {
        estimateRequestId: selectedRequest.id,
        input,
      },
      {
        onSuccess: () => {
          setIsSendOpen(false);
          setToastMessage(t("mover.sentSuccess"));
        },
        onError: (error) => {
          setToastMessage(error instanceof Error ? error.message : t("mover.sendFailed"));
        },
      },
    );
  };

  const rejectEstimate = (reason: string) => {
    if (!requestToReject) return;

    rejectEstimateMutation.mutate(
      {
        estimateRequestId: requestToReject.id,
        input: { reason },
      },
      {
        onSuccess: () => {
          setIsRejectOpen(false);
          setToastMessage(t("mover.rejectSuccess"));
        },
        onError: (error) => {
          setToastMessage(error instanceof Error ? error.message : t("mover.rejectFailed"));
        },
      },
    );
  };

  return {
    selectedRequest,
    requestToReject,
    isSendOpen,
    isRejectOpen,
    isSendingEstimate: sendEstimateMutation.isPending,
    isRejectingEstimate: rejectEstimateMutation.isPending,
    toastMessage,

    openSendModal,
    closeSendModal,
    clearSelectedRequest,

    openRejectModal,
    closeRejectModal,
    clearRequestToReject,

    sendEstimate,
    rejectEstimate,
    clearToast: () => setToastMessage(null),
  };
}
