"use client";

import type { InfiniteData, UseInfiniteQueryResult } from "@tanstack/react-query";

import EmptyState from "@/components/common/EmptyState/EmptyState";
import GiveawayCard from "@/components/giveaway/GiveawayCard";
import GiveawayCardSkeletonList from "@/components/giveaway/GiveawayCardSkeletonList";
import GiveawayInfiniteListChrome from "@/components/giveaway/GiveawayInfiniteListChrome";
import {
  GIVEAWAY_ABOVE_THE_FOLD_THUMBNAIL_COUNT,
  GIVEAWAY_EMPTY_DESCRIPTION_LINES,
  GIVEAWAY_EMPTY_FILTER_DESCRIPTION_LINES,
} from "@/lib/constants/giveaway";
import type { ApiError } from "@/types/api";
import type { GiveawayListItem, GiveawayListResult } from "@/types/giveaway";

interface GiveawayListViewProps {
  giveaways: GiveawayListItem[];
  isInitialLoading: boolean;
  isFilterFetching: boolean;
  hasActiveFilters: boolean;
  query: UseInfiniteQueryResult<InfiniteData<GiveawayListResult>, ApiError>;
}

const toEmptyDescription = (lines: readonly [string, string]) => (
  <>
    {lines[0]}
    <br />
    {lines[1]}
  </>
);

const GiveawayListView = ({
  giveaways,
  isInitialLoading,
  isFilterFetching,
  hasActiveFilters,
  query,
}: GiveawayListViewProps) => {
  const emptyDescription = toEmptyDescription(
    hasActiveFilters ? GIVEAWAY_EMPTY_FILTER_DESCRIPTION_LINES : GIVEAWAY_EMPTY_DESCRIPTION_LINES,
  );

  return (
    <GiveawayInfiniteListChrome
      itemCount={giveaways.length}
      isInitialLoading={isInitialLoading}
      isFilterFetching={isFilterFetching}
      query={query}
      loadingFallback={<GiveawayCardSkeletonList />}
      emptyFallback={
        <EmptyState
          size="sm"
          imageSrc="/images/empty/character.png"
          description={emptyDescription}
        />
      }
      initialErrorFallback="나눔 글 목록을 불러오지 못했습니다. 잠시 후 다시 시도해주세요."
      fetchingStatusLabel="나눔 글 목록을 불러오는 중이에요"
      nextPageLoadingLabel="나눔 글을 더 불러오는 중이에요"
      nextPageErrorMessage="다음 나눔 글을 불러오지 못했습니다."
    >
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
    </GiveawayInfiniteListChrome>
  );
};

export default GiveawayListView;
