import { getTranslations } from "next-intl/server";
import type { Metadata } from "next";

import GiveawayPageView from "@/components/giveaway/GiveawayPageView";
import { parseGiveawaySearchParams } from "@/lib/utils/giveawaySearchParams";

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations("giveaway");
  return { title: t("metadata.title"), description: t("metadata.description") };
}

interface GiveawayPageProps {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}

const GiveawayPage = async ({ searchParams }: GiveawayPageProps) => {
  const filters = parseGiveawaySearchParams(await searchParams);

  return <GiveawayPageView filters={filters} />;
};

export default GiveawayPage;
