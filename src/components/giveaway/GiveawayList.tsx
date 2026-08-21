"use client";

import GiveawayListView from "@/components/giveaway/GiveawayListView";
import { useGiveaways } from "@/hooks/giveaway/useGiveaways";
import type { GiveawaySearchParamsState } from "@/lib/utils/giveawaySearchParams";

interface GiveawayListProps {
  filters: GiveawaySearchParamsState;
}

const GiveawayList = ({ filters }: GiveawayListProps) => {
  const { giveaways, isInitialLoading, isFilterFetching, query } = useGiveaways(filters);

  return (
    <GiveawayListView
      giveaways={giveaways}
      isInitialLoading={isInitialLoading}
      isFilterFetching={isFilterFetching}
      query={query}
    />
  );
};

export default GiveawayList;
