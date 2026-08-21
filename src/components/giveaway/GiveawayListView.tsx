"use client";

import type { InfiniteData, UseInfiniteQueryResult } from "@tanstack/react-query";
import { type ReactNode } from "react";

import EmptyState from "@/components/common/EmptyState/EmptyState";
import { Text } from "@/components/common/Text";
import EstimatesQueryStatus from "@/components/estimate/EstimatesQueryStatus";
import GiveawayCard from "@/components/giveaway/GiveawayCard";
import GiveawayCardSkeletonList from "@/components/giveaway/GiveawayCardSkeletonList";
import { useMoversInfiniteScroll } from "@/hooks/useMoversInfiniteScroll";
import { getApiErrorMessage } from "@/lib/api/getApiErrorMessage";
import { APP_ROUTES } from "@/lib/constants/appRoutes";
import {
  GIVEAWAY_ABOVE_THE_FOLD_THUMBNAIL_COUNT,
  GIVEAWAY_EMPTY_DESCRIPTION_LINES,
  GIVEAWAY_WRITE_BUTTON_LABEL,
} from "@/lib/constants/giveaway";
import { cn } from "@/lib/utils/cn";
import type { ApiError } from "@/types/api";
import type { GiveawayListItem, GiveawayListResult } from "@/types/giveaway";

interface GiveawayListViewProps {
  giveaways: GiveawayListItem[];
  isInitialLoading: boolean;
  isFilterFetching: boolean;
  query: UseInfiniteQueryResult<InfiniteData<GiveawayListResult>, ApiError>;
}

const EMPTY_DESCRIPTION = (
  <>
    {GIVEAWAY_EMPTY_DESCRIPTION_LINES[0]}
    <br />
    {GIVEAWAY_EMPTY_DESCRIPTION_LINES[1]}
  </>
);

const GiveawayListView = ({
  giveaways,
  isInitialLoading,
  isFilterFetching,
  query,
}: GiveawayListViewProps) => {
  const { hasNextPage, isFetchingNextPage, isFetchNextPageError, fetchNextPage, refetch } = query;

  const sentinelRef = useMoversInfiniteScroll({
    enabled: !isInitialLoading && !isFilterFetching && !query.isError && giveaways.length > 0,
    hasNextPage,
    isFetchingNextPage,
    isFetchNextPageError,
    fetchNextPage,
  });

  let content: ReactNode;

  if (isInitialLoading) {
    content = <GiveawayCardSkeletonList />;
  } else if (query.isError && giveaways.length === 0) {
    content = (
      <EstimatesQueryStatus
        message={getApiErrorMessage(
          query.error,
          "나눔 글 목록을 불러오지 못했습니다. 잠시 후 다시 시도해주세요.",
        )}
        actionLabel="다시 시도"
        onAction={() => {
          void refetch();
        }}
        actionBusy={query.isFetching}
      />
    );
  } else if (giveaways.length === 0) {
    content = (
      <EmptyState
        size="sm"
        imageSrc="/images/empty/character.png"
        description={EMPTY_DESCRIPTION}
        buttonLabel={GIVEAWAY_WRITE_BUTTON_LABEL}
        href={APP_ROUTES.COMMUNITY.GIVEAWAY_WRITE}
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
            나눔 글 목록을 불러오는 중이에요
          </span>
        ) : null}
        <ul className="grid grid-cols-1 gap-20 md:grid-cols-2 xl:grid-cols-4">
          {giveaways.map((giveaway, index) => (
            <li key={giveaway.id}>
              <GiveawayCard
                giveaway={giveaway}
                preloadThumbnail={index < GIVEAWAY_ABOVE_THE_FOLD_THUMBNAIL_COUNT}
              />
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
              나눔 글을 더 불러오는 중이에요
            </Text>
          </div>
        ) : null}

        {isFetchNextPageError && !isFetchingNextPage ? (
          <EstimatesQueryStatus
            className="py-24 md:py-32"
            message="다음 나눔 글을 불러오지 못했습니다."
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

export default GiveawayListView;
