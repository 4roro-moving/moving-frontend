"use client";

import GiveawayCreateButton from "@/components/giveaway/GiveawayCreateButton";
import GiveawayCreateModal from "@/components/giveaway/GiveawayCreateModal";
import GiveawayList from "@/components/giveaway/GiveawayList";
import GiveawayPageLayout from "@/components/giveaway/GiveawayPageLayout";
import { useGiveawayCreateAction } from "@/hooks/giveaway/useGiveawayCreateAction";
import type { GiveawaySearchParamsState } from "@/lib/utils/giveawaySearchParams";

interface GiveawayPageViewProps {
  filters: GiveawaySearchParamsState;
}

const GiveawayPageView = ({ filters }: GiveawayPageViewProps) => {
  const { isCreateOpen, openCreate, closeCreate } = useGiveawayCreateAction();

  return (
    <>
      <GiveawayPageLayout filters={filters}>
        <GiveawayCreateButton onClick={openCreate} />
        <GiveawayList filters={filters} onWriteClick={openCreate} />
      </GiveawayPageLayout>

      <GiveawayCreateModal open={isCreateOpen} onClose={closeCreate} />
    </>
  );
};

export default GiveawayPageView;
