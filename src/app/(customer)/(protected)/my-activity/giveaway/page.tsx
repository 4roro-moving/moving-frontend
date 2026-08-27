import { getTranslations } from "next-intl/server";
import type { Metadata } from "next";

import MyGiveawayPageView from "@/components/giveaway/MyGiveawayPageView";
import { parseMyGiveawaySearchParams } from "@/lib/utils/giveawaySearchParams";

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations("giveaway");
  return { title: t("metadata.myTitle"), description: t("metadata.myDescription") };
}

interface MyGiveawayPageProps {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}

const MyGiveawayPage = async ({ searchParams }: MyGiveawayPageProps) => {
  const filters = parseMyGiveawaySearchParams(await searchParams);

  return <MyGiveawayPageView filters={filters} />;
};

export default MyGiveawayPage;
