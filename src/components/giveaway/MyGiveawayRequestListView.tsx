"use client";

import { useTranslations } from "next-intl";

import type { InfiniteData, UseInfiniteQueryResult } from "@tanstack/react-query";

import EmptyState from "@/components/common/EmptyState/EmptyState";
import GiveawayInfiniteListChrome from "@/components/giveaway/GiveawayInfiniteListChrome";
import MyGiveawayRequestCard from "@/components/giveaway/MyGiveawayRequestCard";
import MyGiveawayRequestCardSkeletonList from "@/components/giveaway/MyGiveawayRequestCardSkeletonList";
import { APP_ROUTES } from "@/lib/constants/appRoutes";
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
  const t = useTranslations("giveaway");
  const tCommon = useTranslations("common");
  const emptyDescription = toEmptyDescription(
    hasActiveFilters
      ? ([
          tCommon("emptyState.noResultsTitle"),
          tCommon("emptyState.noResultsDescription"),
        ] as const)
      : ([t("myRequestsEmpty"), t("myRequestsEmptyDescription")] as const),
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
          buttonLabel={hasActiveFilters ? undefined : t("myRequestsEmptyAction")}
          href={hasActiveFilters ? undefined : APP_ROUTES.COMMUNITY.GIVEAWAY}
        />
      }
      initialErrorFallback={t("myRequestsLoadFailed")}
      fetchingStatusLabel={t("myRequestsLoading")}
      nextPageLoadingLabel={t("myRequestsNextLoading")}
      nextPageErrorMessage={t("myRequestsNextError")}
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
