"use client";

import GiveawayListView from "@/components/giveaway/GiveawayListView";
import { useGiveaways } from "@/hooks/giveaway/useGiveaways";
import type { GiveawaySearchParamsState } from "@/lib/utils/giveawaySearchParams";

interface GiveawayListProps {
  filters: GiveawaySearchParamsState;
  onWriteClick: () => void;
}

const GiveawayList = ({ filters, onWriteClick }: GiveawayListProps) => {
  const { giveaways, isInitialLoading, isFilterFetching, query } = useGiveaways(filters);

  return (
    <GiveawayListView
      giveaways={giveaways}
      isInitialLoading={isInitialLoading}
      isFilterFetching={isFilterFetching}
      query={query}
      onWriteClick={onWriteClick}
    />
  );
};

export default GiveawayList;
