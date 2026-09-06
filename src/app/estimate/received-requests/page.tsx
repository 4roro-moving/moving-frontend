import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";

import MoverAuthGate from "@/components/auth/MoverAuthGate";
import ReceivedRequestsPage from "@/components/estimate/ReceivedRequestsPage";
import { ReceivedRequestsPageSkeleton } from "@/components/estimate/ReceivedRequestsSkeleton";

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations("estimates");

  return {
    title: t("metadata.receivedRequestsTitle"),
    description: t("metadata.receivedRequestsDescription"),
  };
}

export default function Page() {
  return (
    <MoverAuthGate loadingFallback={<ReceivedRequestsPageSkeleton />}>
      <div className="bg-background-default text-text-primary min-h-screen">
        <ReceivedRequestsPage />
      </div>
    </MoverAuthGate>
  );
}
