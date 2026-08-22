import type { Metadata } from "next";
import { notFound } from "next/navigation";

import GiveawayDetailClient from "@/components/giveaway/GiveawayDetailClient";
import { GIVEAWAY_DETAIL_TITLE } from "@/lib/constants/giveaway";

export const metadata: Metadata = {
  title: GIVEAWAY_DETAIL_TITLE,
  description: "나눔 글 상세와 신청 내역을 확인하세요.",
};

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
