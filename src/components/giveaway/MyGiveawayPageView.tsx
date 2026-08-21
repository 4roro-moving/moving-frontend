"use client";

import GiveawayCreateButton from "@/components/giveaway/GiveawayCreateButton";
import GiveawayCreateModal from "@/components/giveaway/GiveawayCreateModal";
import GiveawayListView from "@/components/giveaway/GiveawayListView";
import GiveawayPageLayout from "@/components/giveaway/GiveawayPageLayout";
import { useGiveawayCreateAction } from "@/hooks/giveaway/useGiveawayCreateAction";
import { useMyGiveaways } from "@/hooks/giveaway/useMyGiveaways";
import {
  hasActiveMyGiveawayFilters,
  type GiveawayMyFilterState,
} from "@/lib/utils/giveawaySearchParams";

interface MyGiveawayPageViewProps {
  filters: GiveawayMyFilterState;
}

const MyGiveawayPageView = ({ filters }: MyGiveawayPageViewProps) => {
  const { giveaways, isInitialLoading, isFilterFetching, query } = useMyGiveaways(filters);
  const { isCreateOpen, openCreate, closeCreate } = useGiveawayCreateAction();

  return (
    <>
      <GiveawayPageLayout variant="my" filters={filters}>
        <GiveawayCreateButton onClick={openCreate} />
        <GiveawayListView
          giveaways={giveaways}
          isInitialLoading={isInitialLoading}
          isFilterFetching={isFilterFetching}
          hasActiveFilters={hasActiveMyGiveawayFilters(filters)}
          query={query}
        />
      </GiveawayPageLayout>

      <GiveawayCreateModal open={isCreateOpen} onClose={closeCreate} />
    </>
  );
};

export default MyGiveawayPageView;
