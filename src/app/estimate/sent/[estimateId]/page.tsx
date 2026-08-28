import { getTranslations } from "next-intl/server";
import type { Metadata } from "next";
import { notFound } from "next/navigation";

import MoverAuthGate from "@/components/auth/MoverAuthGate";
import SentEstimateDetailPage from "@/components/estimate/sent/SentEstimateDetailPage";

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations("estimates");
  return { title: t("metadata.sentDetailTitle"), description: t("metadata.sentDetailDescription") };
}

interface PageProps {
  params: Promise<{ estimateId: string }>;
}

export default async function SentEstimateDetailRoute({ params }: PageProps) {
  const t = await getTranslations("estimates");
  const { estimateId: estimateIdParam } = await params;
  const estimateId = Number(estimateIdParam);

  if (!Number.isSafeInteger(estimateId) || estimateId <= 0) {
    notFound();
  }

  return (
    <MoverAuthGate loadingMessage={t("loading")}>
      <SentEstimateDetailPage estimateId={estimateId} />
    </MoverAuthGate>
  );
}
