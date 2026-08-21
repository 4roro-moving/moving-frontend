"use client";

import type { InfiniteData, UseInfiniteQueryResult } from "@tanstack/react-query";
import { type ReactNode } from "react";

import EmptyState from "@/components/common/EmptyState/EmptyState";
import { Text } from "@/components/common/Text";
import EstimatesQueryStatus from "@/components/estimate/EstimatesQueryStatus";
import MyGiveawayRequestCard from "@/components/giveaway/MyGiveawayRequestCard";
import MyGiveawayRequestCardSkeletonList from "@/components/giveaway/MyGiveawayRequestCardSkeletonList";
import { useMoversInfiniteScroll } from "@/hooks/useMoversInfiniteScroll";
import { getApiErrorMessage } from "@/lib/api/getApiErrorMessage";
import { APP_ROUTES } from "@/lib/constants/appRoutes";
import {
  GIVEAWAY_REQUEST_EMPTY_BUTTON_LABEL,
  GIVEAWAY_REQUEST_EMPTY_DESCRIPTION_LINES,
} from "@/lib/constants/giveaway";
import { cn } from "@/lib/utils/cn";
import type { ApiError } from "@/types/api";
import type { GiveawayRequestMyListResult, MyGiveawayRequestItem } from "@/types/giveaway";

interface MyGiveawayRequestListViewProps {
  requests: MyGiveawayRequestItem[];
  isInitialLoading: boolean;
  isFilterFetching: boolean;
  query: UseInfiniteQueryResult<InfiniteData<GiveawayRequestMyListResult>, ApiError>;
  onEdit: (request: MyGiveawayRequestItem) => void;
  onCancel: (request: MyGiveawayRequestItem) => void;
}

const EMPTY_DESCRIPTION = (
  <>
    {GIVEAWAY_REQUEST_EMPTY_DESCRIPTION_LINES[0]}
    <br />
    {GIVEAWAY_REQUEST_EMPTY_DESCRIPTION_LINES[1]}
  </>
);

const MyGiveawayRequestListView = ({
  requests,
  isInitialLoading,
  isFilterFetching,
  query,
  onEdit,
  onCancel,
}: MyGiveawayRequestListViewProps) => {
  const { hasNextPage, isFetchingNextPage, isFetchNextPageError, fetchNextPage, refetch } = query;

  const sentinelRef = useMoversInfiniteScroll({
    enabled: !isInitialLoading && !isFilterFetching && !query.isError && requests.length > 0,
    hasNextPage,
    isFetchingNextPage,
    isFetchNextPageError,
    fetchNextPage,
  });

  let content: ReactNode;

  if (isInitialLoading) {
    content = <MyGiveawayRequestCardSkeletonList />;
  } else if (query.isError && requests.length === 0) {
    content = (
      <EstimatesQueryStatus
        message={getApiErrorMessage(
          query.error,
          "내가 작성한 나눔 신청글을 불러오지 못했습니다. 잠시 후 다시 시도해주세요.",
        )}
        actionLabel="다시 시도"
        onAction={() => {
          void refetch();
        }}
        actionBusy={query.isFetching}
      />
    );
  } else if (requests.length === 0) {
    content = (
      <EmptyState
        size="sm"
        imageSrc="/images/empty/character.png"
        description={EMPTY_DESCRIPTION}
        buttonLabel={GIVEAWAY_REQUEST_EMPTY_BUTTON_LABEL}
        href={APP_ROUTES.COMMUNITY.GIVEAWAY}
      />
    );
  } else {
    content = (
      <div
        className={cn("flex flex-col gap-20", isFilterFetching && "opacity-60")}
        aria-busy={isFilterFetching}
      >
        {isFilterFetching ? (
          <span className="sr-only" role="status">
            나눔 신청글 목록을 불러오는 중이에요
          </span>
        ) : null}
        <ul className="flex w-full flex-col gap-20">
          {requests.map((request) => (
            <li key={request.id}>
              <MyGiveawayRequestCard request={request} onEdit={onEdit} onCancel={onCancel} />
            </li>
          ))}
        </ul>

        <div ref={sentinelRef} className="h-1 w-full" aria-hidden="true" />

        {isFetchingNextPage ? (
          <div
            className="flex items-center justify-center gap-8 py-12"
            role="status"
            aria-live="polite"
          >
            <span
              className="border-border-brand size-20 animate-spin rounded-full border-2 border-t-transparent"
              aria-hidden="true"
            />
            <Text as="p" variant="sm-medium" className="text-text-muted">
              나눔 신청글을 더 불러오는 중이에요
            </Text>
          </div>
        ) : null}

        {isFetchNextPageError && !isFetchingNextPage ? (
          <EstimatesQueryStatus
            className="py-24 md:py-32"
            message="다음 나눔 신청글을 불러오지 못했습니다."
            actionLabel="다시 시도"
            onAction={() => {
              void fetchNextPage();
            }}
          />
        ) : null}
      </div>
    );
  }

  return <div className="scroll-mt-24">{content}</div>;
};

export default MyGiveawayRequestListView;
