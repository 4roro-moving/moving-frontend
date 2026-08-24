"use client";

import { Text } from "@/components/common/Text";
import GiveawayMyRequestActionOverlays from "@/components/giveaway/GiveawayMyRequestActionOverlays";
import MyGiveawayRequestFilters from "@/components/giveaway/MyGiveawayRequestFilters";
import MyGiveawayRequestListView from "@/components/giveaway/MyGiveawayRequestListView";
import { useMyGiveawayRequestActions } from "@/hooks/giveaway/useMyGiveawayRequestActions";
import { useMyGiveawayRequests } from "@/hooks/giveaway/useMyGiveawayRequests";
import {
  hasActiveGiveawayRequestFilters,
  type GiveawayRequestFilterState,
} from "@/lib/utils/giveawayRequestSearchParams";

interface MyGiveawayRequestPageViewProps {
  filters: GiveawayRequestFilterState;
}

const MyGiveawayRequestPageView = ({ filters }: MyGiveawayRequestPageViewProps) => {
  const { requests, isInitialLoading, isFilterFetching, query } = useMyGiveawayRequests(filters);
  const requestActions = useMyGiveawayRequestActions();

  return (
    <div className="bg-background-default flex w-full flex-col items-center">
      <Text as="h1" variant="2xl-bold" className="sr-only">
        나눔 신청 내역
      </Text>

      <div className="px-margin-mobile md:px-margin-tablet max-w-container-desktop-narrow mx-auto flex w-full flex-col gap-24 pt-40 pb-60 md:pb-52 xl:px-0 xl:pt-54 xl:pb-200">
        <MyGiveawayRequestFilters filters={filters} />
        <MyGiveawayRequestListView
          requests={requests}
          isInitialLoading={isInitialLoading}
          isFilterFetching={isFilterFetching}
          hasActiveFilters={hasActiveGiveawayRequestFilters(filters)}
          query={query}
          onEdit={requestActions.openEdit}
          onCancel={requestActions.openCancel}
        />
      </div>

      <GiveawayMyRequestActionOverlays actions={requestActions} />
    </div>
  );
};

export default MyGiveawayRequestPageView;
