import GiveawayList from "@/components/giveaway/GiveawayList";
import GiveawayPageLayout from "@/components/giveaway/GiveawayPageLayout";
import type { GiveawaySearchParamsState } from "@/lib/utils/giveawaySearchParams";

interface GiveawayPageViewProps {
  filters: GiveawaySearchParamsState;
}

const GiveawayPageView = ({ filters }: GiveawayPageViewProps) => {
  return (
    <GiveawayPageLayout filters={filters}>
      <GiveawayList filters={filters} />
    </GiveawayPageLayout>
  );
};

export default GiveawayPageView;
