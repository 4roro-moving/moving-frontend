import { getTranslations } from "next-intl/server";
import type { Metadata } from "next";

import CustomerAuthGate from "@/components/auth/CustomerAuthGate";
import { PendingEstimatesLoadingSkeleton } from "@/components/estimate/EstimateLoadingSkeletons";
import PendingEstimatesPageClient from "@/components/estimate/pending/PendingEstimatesPageClient";

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations("estimates");
  return { title: t("metadata.pendingTitle"), description: t("metadata.pendingDescription") };
}

export default function PendingEstimatesPage() {
  return (
    <CustomerAuthGate loadingFallback={<PendingEstimatesLoadingSkeleton />}>
      <PendingEstimatesPageClient />
    </CustomerAuthGate>
  );
}
