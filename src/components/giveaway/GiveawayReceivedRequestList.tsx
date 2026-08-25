"use client";

import type { InfiniteData, UseInfiniteQueryResult } from "@tanstack/react-query";

import { Skeleton } from "@/components/common/Skeleton/Skeleton";
import { Text } from "@/components/common/Text";
import GiveawayConfirmModal from "@/components/giveaway/GiveawayConfirmModal";
import GiveawayInfiniteListChrome from "@/components/giveaway/GiveawayInfiniteListChrome";
import GiveawayReceivedRequestCard from "@/components/giveaway/GiveawayReceivedRequestCard";
import { useGiveawayReceivedRequestActions } from "@/hooks/giveaway/useGiveawayReceivedRequestActions";
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

interface GiveawayReceivedRequestListProps {
  giveawayId: number;
  giveawayStatus: GiveawayStatus;
  requests: GiveawayRequestItem[];
  isPending?: boolean;
  query: UseInfiniteQueryResult<InfiniteData<GiveawayRequestListResult>, ApiError>;
}

const RECEIVED_REQUEST_SKELETON_COUNT = 2;

const GiveawayReceivedRequestSkeletonList = () => {
  return (
    <ul className="flex w-full flex-col gap-20" aria-hidden="true">
      {Array.from({ length: RECEIVED_REQUEST_SKELETON_COUNT }, (_, index) => (
        <li key={index}>
          <div className="bg-background-default border-border-subtle shadow-estimate-card rounded-20 flex w-full flex-col gap-16 border-[0.5px] px-20 py-24 md:gap-24 md:px-32 md:py-32 xl:px-40">
            <div className="flex w-full flex-col gap-16 xl:flex-row xl:items-center xl:gap-12">
              <div className="flex min-w-0 flex-1 flex-col gap-8">
                <div className="flex items-start justify-between gap-12">
                  <div className="flex min-w-0 flex-1 items-center gap-12 md:gap-20">
                    <Skeleton className="rounded-12 size-64 shrink-0 md:size-80" />
                    <div className="flex min-w-0 flex-1 flex-col gap-8">
                      <Skeleton className="h-26 w-80" />
                      <Skeleton className="h-24 w-3/4" />
                      <Skeleton className="h-18 w-64" />
                    </div>
                  </div>
                  <Skeleton className="size-32 shrink-0 rounded-full" />
                </div>
                <div className="flex w-full flex-col gap-16 md:flex-row md:items-center md:gap-20">
                  <Skeleton className="h-48 w-64" />
                  <Skeleton className="h-48 w-160" />
                </div>
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

const GiveawayReceivedRequestList = ({
  giveawayId,
  giveawayStatus,
  requests,
  isPending = false,
  query,
}: GiveawayReceivedRequestListProps) => {
  const {
    selectedRequest,
    rejectedRequest,
    selectError,
    rejectError,
    isActionPending,
    isSelectPending,
    isRejectPending,
    openSelect,
    openReject,
    closeSelect,
    closeReject,
    confirmSelect,
    confirmReject,
  } = useGiveawayReceivedRequestActions(giveawayId);

  return (
    <section
      className="flex w-full flex-col gap-20"
      aria-labelledby="giveaway-received-requests-title"
    >
      <Text
        as="h2"
        id="giveaway-received-requests-title"
        variant={{ base: "xl-bold", md: "2xl-bold" }}
        className="text-text-primary"
      >
        {GIVEAWAY_RECEIVED_REQUESTS_TITLE}
      </Text>

      <GiveawayInfiniteListChrome
        itemCount={requests.length}
        isInitialLoading={isPending}
        isFilterFetching={false}
        query={query}
        loadingFallback={
          <>
            <GiveawayReceivedRequestSkeletonList />
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
              <GiveawayReceivedRequestCard
                request={request}
                giveawayStatus={giveawayStatus}
                isActionPending={isActionPending}
                onSelect={openSelect}
                onReject={openReject}
              />
            </li>
          ))}
        </ul>
      </GiveawayInfiniteListChrome>

      <GiveawayConfirmModal
        open={selectedRequest !== null}
        title="나눔 진행"
        description="이 신청자와 나눔을 진행할까요?"
        confirmLabel={GIVEAWAY_SHARE_BUTTON_LABEL}
        pendingLabel="처리 중..."
        isPending={isSelectPending}
        error={selectError}
        onClose={closeSelect}
        onConfirm={() => void confirmSelect()}
      />
      <GiveawayConfirmModal
        open={rejectedRequest !== null}
        title="신청 거절"
        description="이 신청을 거절할까요?"
        confirmLabel={GIVEAWAY_REJECT_BUTTON_LABEL}
        pendingLabel="처리 중..."
        isPending={isRejectPending}
        error={rejectError}
        onClose={closeReject}
        onConfirm={() => void confirmReject()}
      />
    </section>
  );
};

export default GiveawayReceivedRequestList;
