import type { ReactNode } from "react";

import { Text } from "@/components/common/Text";
import GiveawayFilters from "@/components/giveaway/GiveawayFilters";
import type { GiveawaySearchParamsState } from "@/lib/utils/giveawaySearchParams";

interface GiveawayPageLayoutProps {
  filters: GiveawaySearchParamsState;
  children: ReactNode;
}

const GiveawayPageLayout = ({ filters, children }: GiveawayPageLayoutProps) => {
  return (
    <div className="bg-background-default flex w-full flex-col items-center">
      <Text as="h1" variant="2xl-bold" className="sr-only">
        나눔
      </Text>

      <div className="px-margin-mobile md:px-margin-tablet max-w-container-desktop mx-auto flex w-full flex-col gap-24 pt-24 pb-80 xl:px-0 xl:pt-32 xl:pb-120">
        <GiveawayFilters filters={filters} />
        {children}
      </div>
    </div>
  );
};

export default GiveawayPageLayout;
