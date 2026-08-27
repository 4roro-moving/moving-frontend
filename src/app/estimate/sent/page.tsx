import { getTranslations } from "next-intl/server";
import type { Metadata } from "next";

import MoverAuthGate from "@/components/auth/MoverAuthGate";
import MoverEstimateListPageSkeleton from "@/components/estimate/MoverEstimateListSkeleton";
import SentEstimatesPage from "@/components/estimate/sent/SentEstimatesPage";

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations("estimates");
  return { title: t("metadata.sentTitle"), description: t("metadata.sentDescription") };
}

export default function SentEstimatesRoute() {
  return (
    <MoverAuthGate loadingFallback={<MoverEstimateListPageSkeleton />}>
      <SentEstimatesPage />
    </MoverAuthGate>
  );
}
