"use client";

import GiveawayListView from "@/components/giveaway/GiveawayListView";
import GiveawayPageLayout from "@/components/giveaway/GiveawayPageLayout";
import { useMyGiveaways } from "@/hooks/giveaway/useMyGiveaways";
import type { GiveawayMyFilterState } from "@/lib/utils/giveawaySearchParams";

interface MyGiveawayPageViewProps {
  filters: GiveawayMyFilterState;
}

const MyGiveawayPageView = ({ filters }: MyGiveawayPageViewProps) => {
  const { giveaways, isInitialLoading, isFilterFetching, query } = useMyGiveaways(filters);

  return (
    <GiveawayPageLayout variant="my" filters={filters}>
      <GiveawayListView
        giveaways={giveaways}
        isInitialLoading={isInitialLoading}
        isFilterFetching={isFilterFetching}
        query={query}
      />
    </GiveawayPageLayout>
  );
};

export default MyGiveawayPageView;
