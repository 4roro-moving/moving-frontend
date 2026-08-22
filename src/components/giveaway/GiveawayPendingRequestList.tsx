"use client";

import type { InfiniteData, UseInfiniteQueryResult } from "@tanstack/react-query";
import { useState } from "react";

import AlertModal from "@/components/common/Modal/AlertModal";
import Modal from "@/components/common/Modal/Modal";
import { Skeleton } from "@/components/common/Skeleton/Skeleton";
import { Text } from "@/components/common/Text";
import GiveawayInfiniteListChrome from "@/components/giveaway/GiveawayInfiniteListChrome";
import GiveawayPendingRequestCard from "@/components/giveaway/GiveawayPendingRequestCard";
import { useRejectGiveawayRequest } from "@/hooks/giveaway/useRejectGiveawayRequest";
import { useSelectGiveawayRequest } from "@/hooks/giveaway/useSelectGiveawayRequest";
import { getApiErrorMessage } from "@/lib/api/getApiErrorMessage";
import {
  GIVEAWAY_RECEIVED_REQUESTS_EMPTY,
  GIVEAWAY_RECEIVED_REQUESTS_ERROR,
  GIVEAWAY_RECEIVED_REQUESTS_LOADING,
  GIVEAWAY_RECEIVED_REQUESTS_NEXT_PAGE_ERROR,
  GIVEAWAY_RECEIVED_REQUESTS_NEXT_PAGE_LOADING,
  GIVEAWAY_RECEIVED_REQUESTS_TITLE,
  GIVEAWAY_REJECT_BUTTON_LABEL,
  GIVEAWAY_SHARE_BUTTON_LABEL,
} from "@/lib/constants/giveaway";
import type { ApiError } from "@/types/api";
import type {
  GiveawayRequestItem,
  GiveawayRequestListResult,
  GiveawayStatus,
} from "@/types/giveaway";

interface GiveawayPendingRequestListProps {
  giveawayId: number;
  giveawayStatus: GiveawayStatus;
  requests: GiveawayRequestItem[];
  isPending?: boolean;
  query: UseInfiniteQueryResult<InfiniteData<GiveawayRequestListResult>, ApiError>;
}

const PENDING_REQUEST_SKELETON_COUNT = 2;

const GiveawayPendingRequestSkeletonList = () => {
  return (
    <ul className="flex w-full flex-col gap-20" aria-hidden="true">
      {Array.from({ length: PENDING_REQUEST_SKELETON_COUNT }, (_, index) => (
        <li key={index}>
          <div className="bg-background-default border-border-subtle shadow-estimate-card rounded-20 flex w-full flex-col gap-16 border-[0.5px] px-20 py-24 md:gap-24 md:px-32 md:py-32 xl:px-40">
            <div className="flex w-full flex-col gap-16 xl:flex-row xl:items-center xl:gap-12">
              <div className="flex min-w-0 flex-1 flex-col gap-8">
                <div className="flex items-center gap-12 md:gap-20">
                  <Skeleton className="rounded-12 size-64 shrink-0 md:size-80" />
                  <div className="flex min-w-0 flex-1 flex-col gap-8">
                    <Skeleton className="h-26 w-80" />
                    <Skeleton className="h-24 w-3/4" />
                    <Skeleton className="h-18 w-64" />
                  </div>
                </div>
                <div className="flex w-full flex-col gap-16 md:flex-row md:items-center md:gap-20">
                  <Skeleton className="h-48 w-64" />
                  <Skeleton className="h-48 w-160" />
                </div>
                <Skeleton className="h-22 w-64" />
              </div>
              <div className="flex w-full flex-col gap-8 xl:w-160 xl:shrink-0">
                <Skeleton className="rounded-12 h-54 w-full" />
                <Skeleton className="rounded-12 h-54 w-full" />
              </div>
            </div>
          </div>
        </li>
      ))}
    </ul>
  );
};

const GiveawayPendingRequestList = ({
  giveawayId,
  giveawayStatus,
  requests,
  isPending = false,
  query,
}: GiveawayPendingRequestListProps) => {
  const selectMutation = useSelectGiveawayRequest();
  const rejectMutation = useRejectGiveawayRequest();
  const [selectedRequest, setSelectedRequest] = useState<GiveawayRequestItem | null>(null);
  const [rejectedRequest, setRejectedRequest] = useState<GiveawayRequestItem | null>(null);
  const [actionError, setActionError] = useState<string | undefined>();
  const isActionPending = selectMutation.isPending || rejectMutation.isPending;

  const handleSelect = async () => {
    if (!selectedRequest) {
      return;
    }

    try {
      setActionError(undefined);
      await selectMutation.mutateAsync({ giveawayId, requestId: selectedRequest.id });
      setSelectedRequest(null);
    } catch (error) {
      setActionError(getApiErrorMessage(error, "나눔 상대를 선정하지 못했습니다."));
    }
  };

  const handleReject = async () => {
    if (!rejectedRequest) {
      return;
    }

    try {
      setActionError(undefined);
      await rejectMutation.mutateAsync({ giveawayId, requestId: rejectedRequest.id });
      setRejectedRequest(null);
    } catch (error) {
      setActionError(getApiErrorMessage(error, "나눔 신청을 거절하지 못했습니다."));
    }
  };

  return (
    <section
      className="flex w-full flex-col gap-20"
      aria-labelledby="giveaway-pending-requests-title"
    >
      <Text
        as="h2"
        id="giveaway-pending-requests-title"
        variant={{ base: "xl-bold", md: "2xl-bold" }}
        className="text-text-primary"
      >
        {GIVEAWAY_RECEIVED_REQUESTS_TITLE}
      </Text>

      {actionError ? (
        <Text as="p" variant="sm-medium" className="text-text-error" role="alert">
          {actionError}
        </Text>
      ) : null}

      <GiveawayInfiniteListChrome
        itemCount={requests.length}
        isInitialLoading={isPending}
        isFilterFetching={false}
        query={query}
        loadingFallback={
          <>
            <GiveawayPendingRequestSkeletonList />
            <p className="sr-only" role="status">
              {GIVEAWAY_RECEIVED_REQUESTS_LOADING}
            </p>
          </>
        }
        emptyFallback={
          <Text as="p" variant="md-medium" className="text-text-muted">
            {GIVEAWAY_RECEIVED_REQUESTS_EMPTY}
          </Text>
        }
        initialErrorFallback={GIVEAWAY_RECEIVED_REQUESTS_ERROR}
        fetchingStatusLabel={GIVEAWAY_RECEIVED_REQUESTS_LOADING}
        nextPageLoadingLabel={GIVEAWAY_RECEIVED_REQUESTS_NEXT_PAGE_LOADING}
        nextPageErrorMessage={GIVEAWAY_RECEIVED_REQUESTS_NEXT_PAGE_ERROR}
      >
        <ul className="flex w-full flex-col gap-20">
          {requests.map((request) => (
            <li key={request.id}>
              <GiveawayPendingRequestCard
                request={request}
                giveawayStatus={giveawayStatus}
                isActionPending={isActionPending}
                onSelect={setSelectedRequest}
                onReject={setRejectedRequest}
              />
            </li>
          ))}
        </ul>
      </GiveawayInfiniteListChrome>

      <AlertModal
        open={selectedRequest !== null}
        onClose={isActionPending ? undefined : () => setSelectedRequest(null)}
        closeDisabled={isActionPending}
        size="sm"
        title="나눔 진행"
        description="이 신청자와 나눔을 진행할까요?"
        actions={
          <div className="flex w-full flex-col-reverse gap-10 md:flex-row md:gap-12">
            <Modal.Button
              type="button"
              variant="outline"
              size="cta"
              fullWidth
              disabled={isActionPending}
              onClick={() => setSelectedRequest(null)}
              className="md:flex-1"
            >
              닫기
            </Modal.Button>
            <Modal.Button
              type="button"
              variant="solid"
              size="cta"
              fullWidth
              disabled={isActionPending}
              onClick={() => void handleSelect()}
              className="md:flex-1"
            >
              {isActionPending ? "처리 중..." : GIVEAWAY_SHARE_BUTTON_LABEL}
            </Modal.Button>
          </div>
        }
      />

      <AlertModal
        open={rejectedRequest !== null}
        onClose={isActionPending ? undefined : () => setRejectedRequest(null)}
        closeDisabled={isActionPending}
        size="sm"
        title="신청 거절"
        description="이 신청을 거절할까요?"
        actions={
          <div className="flex w-full flex-col-reverse gap-10 md:flex-row md:gap-12">
            <Modal.Button
              type="button"
              variant="outline"
              size="cta"
              fullWidth
              disabled={isActionPending}
              onClick={() => setRejectedRequest(null)}
              className="md:flex-1"
            >
              닫기
            </Modal.Button>
            <Modal.Button
              type="button"
              variant="solid"
              size="cta"
              fullWidth
              disabled={isActionPending}
              onClick={() => void handleReject()}
              className="md:flex-1"
            >
              {isActionPending ? "처리 중..." : GIVEAWAY_REJECT_BUTTON_LABEL}
            </Modal.Button>
          </div>
        }
      />
    </section>
  );
};

export default GiveawayPendingRequestList;
