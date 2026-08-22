"use client";

import type { InfiniteData, UseInfiniteQueryResult } from "@tanstack/react-query";

import EmptyState from "@/components/common/EmptyState/EmptyState";
import GiveawayInfiniteListChrome from "@/components/giveaway/GiveawayInfiniteListChrome";
import MyGiveawayRequestCard from "@/components/giveaway/MyGiveawayRequestCard";
import MyGiveawayRequestCardSkeletonList from "@/components/giveaway/MyGiveawayRequestCardSkeletonList";
import { APP_ROUTES } from "@/lib/constants/appRoutes";
import {
  GIVEAWAY_EMPTY_FILTER_DESCRIPTION_LINES,
  GIVEAWAY_REQUEST_EMPTY_BUTTON_LABEL,
  GIVEAWAY_REQUEST_EMPTY_DESCRIPTION_LINES,
} from "@/lib/constants/giveaway";
import type { ApiError } from "@/types/api";
import type { GiveawayRequestMyListResult, MyGiveawayRequestItem } from "@/types/giveaway";

interface MyGiveawayRequestListViewProps {
  requests: MyGiveawayRequestItem[];
  isInitialLoading: boolean;
  isFilterFetching: boolean;
  hasActiveFilters: boolean;
  query: UseInfiniteQueryResult<InfiniteData<GiveawayRequestMyListResult>, ApiError>;
  onEdit: (request: MyGiveawayRequestItem) => void;
  onCancel: (request: MyGiveawayRequestItem) => void;
}

const toEmptyDescription = (lines: readonly [string, string]) => (
  <>
    {lines[0]}
    <br />
    {lines[1]}
  </>
);

const MyGiveawayRequestListView = ({
  requests,
  isInitialLoading,
  isFilterFetching,
  hasActiveFilters,
  query,
  onEdit,
  onCancel,
}: MyGiveawayRequestListViewProps) => {
  const emptyDescription = toEmptyDescription(
    hasActiveFilters
      ? GIVEAWAY_EMPTY_FILTER_DESCRIPTION_LINES
      : GIVEAWAY_REQUEST_EMPTY_DESCRIPTION_LINES,
  );

  return (
    <GiveawayInfiniteListChrome
      itemCount={requests.length}
      isInitialLoading={isInitialLoading}
      isFilterFetching={isFilterFetching}
      query={query}
      loadingFallback={<MyGiveawayRequestCardSkeletonList />}
      emptyFallback={
        <EmptyState
          size="sm"
          imageSrc="/images/empty/character.png"
          description={emptyDescription}
          buttonLabel={hasActiveFilters ? undefined : GIVEAWAY_REQUEST_EMPTY_BUTTON_LABEL}
          href={hasActiveFilters ? undefined : APP_ROUTES.COMMUNITY.GIVEAWAY}
        />
      }
      initialErrorFallback="내가 작성한 나눔 신청글을 불러오지 못했습니다. 잠시 후 다시 시도해주세요."
      fetchingStatusLabel="나눔 신청글 목록을 불러오는 중이에요"
      nextPageLoadingLabel="나눔 신청글을 더 불러오는 중이에요"
      nextPageErrorMessage="다음 나눔 신청글을 불러오지 못했습니다."
    >
      <ul className="flex w-full flex-col gap-20">
        {requests.map((request) => (
          <li key={request.id}>
            <MyGiveawayRequestCard request={request} onEdit={onEdit} onCancel={onCancel} />
          </li>
        ))}
      </ul>
    </GiveawayInfiniteListChrome>
  );
};

export default MyGiveawayRequestListView;
