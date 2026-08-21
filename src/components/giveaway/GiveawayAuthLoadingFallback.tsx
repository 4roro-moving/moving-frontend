"use client";

import { useSearchParams } from "next/navigation";

import CommunityShell from "@/components/community/CommunityShell";
import GiveawayCardSkeletonList from "@/components/giveaway/GiveawayCardSkeletonList";
import GiveawayCreateButton from "@/components/giveaway/GiveawayCreateButton";
import GiveawayPageLayout from "@/components/giveaway/GiveawayPageLayout";
import { parseGiveawaySearchParams } from "@/lib/utils/giveawaySearchParams";

const GiveawayAuthLoadingFallback = () => {
  const searchParams = useSearchParams();
  const filters = parseGiveawaySearchParams(Object.fromEntries(searchParams.entries()));

  return (
    <CommunityShell showGiveawayTab>
      <GiveawayPageLayout filters={filters}>
        <GiveawayCreateButton disabled />
        <GiveawayCardSkeletonList />
      </GiveawayPageLayout>
    </CommunityShell>
  );
};

export default GiveawayAuthLoadingFallback;
