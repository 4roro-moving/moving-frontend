"use client";

import { useState } from "react";

import { useRejectGiveawayRequest } from "@/hooks/giveaway/useRejectGiveawayRequest";
import { useSelectGiveawayRequest } from "@/hooks/giveaway/useSelectGiveawayRequest";
import { getApiErrorMessage } from "@/lib/api/getApiErrorMessage";
import type { GiveawayRequestItem } from "@/types/giveaway";

export const useGiveawayReceivedRequestActions = (giveawayId: number) => {
  const selectMutation = useSelectGiveawayRequest();
  const rejectMutation = useRejectGiveawayRequest();
  const [selectedRequest, setSelectedRequest] = useState<GiveawayRequestItem | null>(null);
  const [rejectedRequest, setRejectedRequest] = useState<GiveawayRequestItem | null>(null);
  const [selectError, setSelectError] = useState<string | undefined>();
  const [rejectError, setRejectError] = useState<string | undefined>();
  const isActionPending = selectMutation.isPending || rejectMutation.isPending;

  const closeSelect = () => {
    if (selectMutation.isPending) {
      return;
    }

    setSelectError(undefined);
    setSelectedRequest(null);
  };

  const closeReject = () => {
    if (rejectMutation.isPending) {
      return;
    }

    setRejectError(undefined);
    setRejectedRequest(null);
  };

  const confirmSelect = async () => {
    if (!selectedRequest) {
      return;
    }

    try {
      setSelectError(undefined);
      await selectMutation.mutateAsync({ giveawayId, requestId: selectedRequest.id });
      setSelectedRequest(null);
    } catch (error) {
      setSelectError(getApiErrorMessage(error, "나눔 상대를 선정하지 못했습니다."));
    }
  };

  const confirmReject = async () => {
    if (!rejectedRequest) {
      return;
    }

    try {
      setRejectError(undefined);
      await rejectMutation.mutateAsync({ giveawayId, requestId: rejectedRequest.id });
      setRejectedRequest(null);
    } catch (error) {
      setRejectError(getApiErrorMessage(error, "나눔 신청을 거절하지 못했습니다."));
    }
  };

  return {
    selectedRequest,
    rejectedRequest,
    selectError,
    rejectError,
    isActionPending,
    isSelectPending: selectMutation.isPending,
    isRejectPending: rejectMutation.isPending,
    openSelect: setSelectedRequest,
    openReject: setRejectedRequest,
    closeSelect,
    closeReject,
    confirmSelect,
    confirmReject,
  };
};
