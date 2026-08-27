import { getTranslations } from "next-intl/server";
import type { Metadata } from "next";

import CustomerAuthGate from "@/components/auth/CustomerAuthGate";
import { ReceivedEstimatesLoadingSkeleton } from "@/components/estimate/EstimateLoadingSkeletons";
import ReceivedEstimatesPageClient from "@/components/estimate/received/ReceivedEstimatesPageClient";

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations("estimates");
  return { title: t("metadata.receivedTitle"), description: t("metadata.receivedDescription") };
}

export default function ReceivedEstimatesPage() {
  return (
    <CustomerAuthGate
      loadingFallback={
        <div className="bg-background-default md:bg-background-subtle flex w-full flex-col items-center py-38 md:py-32 xl:py-64">
          <ReceivedEstimatesLoadingSkeleton />
        </div>
      }
    >
      <ReceivedEstimatesPageClient />
    </CustomerAuthGate>
  );
}
