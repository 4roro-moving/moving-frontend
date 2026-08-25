import { getTranslations } from "next-intl/server";
import type { Metadata } from "next";
import { notFound } from "next/navigation";

import GiveawayDetailClient from "@/components/giveaway/GiveawayDetailClient";

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations("giveaway");
  return { title: t("metadata.detailTitle"), description: t("metadata.detailDescription") };
}

interface GiveawayDetailPageProps {
  params: Promise<{ giveawayId: string }>;
}

const GiveawayDetailPage = async ({ params }: GiveawayDetailPageProps) => {
  const { giveawayId } = await params;
  const parsedGiveawayId = Number(giveawayId);

  if (!Number.isSafeInteger(parsedGiveawayId) || parsedGiveawayId <= 0) {
    notFound();
  }

  return <GiveawayDetailClient giveawayId={parsedGiveawayId} />;
};

export default GiveawayDetailPage;
