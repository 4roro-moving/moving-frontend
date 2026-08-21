import type { Metadata } from "next";

import GiveawayPageView from "@/components/giveaway/GiveawayPageView";
import { parseGiveawaySearchParams } from "@/lib/utils/giveawaySearchParams";

export const metadata: Metadata = {
  title: "나눔",
  description: "지역별 나눔 글을 확인하고 검색·필터로 찾아보세요.",
};

interface GiveawayPageProps {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}

const GiveawayPage = async ({ searchParams }: GiveawayPageProps) => {
  const filters = parseGiveawaySearchParams(await searchParams);

  return <GiveawayPageView filters={filters} />;
};

export default GiveawayPage;
