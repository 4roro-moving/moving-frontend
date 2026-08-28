import { getTranslations } from "next-intl/server";
import type { Metadata } from "next";

import MoverAuthGate from "@/components/auth/MoverAuthGate";
import MoverEstimateListPageSkeleton from "@/components/estimate/MoverEstimateListSkeleton";
import RejectedRequestsPage from "@/components/estimate/RejectedRequestsPage";

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations("estimates");
  return { title: t("metadata.rejectedTitle"), description: t("metadata.rejectedDescription") };
}

export default function RejectedRequestsRoute() {
  return (
    <MoverAuthGate loadingFallback={<MoverEstimateListPageSkeleton />}>
      <RejectedRequestsPage />
    </MoverAuthGate>
  );
}
