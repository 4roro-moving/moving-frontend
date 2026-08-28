import { getTranslations } from "next-intl/server";
import type { Metadata } from "next";

import MyGiveawayRequestPageView from "@/components/giveaway/MyGiveawayRequestPageView";
import { parseGiveawayRequestSearchParams } from "@/lib/utils/giveawayRequestSearchParams";

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations("giveaway");
  return { title: t("metadata.myRequestsTitle"), description: t("metadata.myRequestsDescription") };
}

interface MyGiveawayRequestPageProps {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}

const MyGiveawayRequestPage = async ({ searchParams }: MyGiveawayRequestPageProps) => {
  const filters = parseGiveawayRequestSearchParams(await searchParams);

  return <MyGiveawayRequestPageView filters={filters} />;
};

export default MyGiveawayRequestPage;
