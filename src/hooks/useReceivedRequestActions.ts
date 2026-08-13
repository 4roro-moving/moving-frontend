import { useState } from "react";

import type { SendEstimateInput } from "@/components/estimate/SendEstimateModal";
import { useRejectMoverEstimate, useSendMoverEstimate } from "@/hooks/useMoverEstimateRequests";
import type { MoverEstimateRequest } from "@/types/moverEstimateRequest";

export function useReceivedRequestActions() {
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
          setToastMessage("견적을 보냈습니다.");
        },
        onError: (error) => {
          setToastMessage(error instanceof Error ? error.message : "견적 전송에 실패했습니다.");
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
          setToastMessage("요청을 반려했습니다.");
        },
        onError: (error) => {
          setToastMessage(error instanceof Error ? error.message : "요청 반려에 실패했습니다.");
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
