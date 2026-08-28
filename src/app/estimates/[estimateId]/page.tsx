import { getTranslations } from "next-intl/server";
import type { Metadata } from "next";
import { notFound } from "next/navigation";

import CustomerAuthGate from "@/components/auth/CustomerAuthGate";
import {
  ESTIMATE_DETAIL_LAYOUT_CLASSES,
  EstimateDetailLoadingState,
} from "@/components/estimate/detail/EstimateDetailLayout";
import EstimateDetailView from "@/components/estimate/detail/EstimateDetailView";
import { APP_ROUTES } from "@/lib/constants/appRoutes";
import { cn } from "@/lib/utils/cn";
import { parsePositiveIntId } from "@/lib/utils/parsePositiveIntId";

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations("estimates");
  return { title: t("metadata.detailTitle"), description: t("metadata.detailDescription") };
}

interface EstimateDetailPageProps {
  params: Promise<{ estimateId: string }>;
}

export default async function EstimateDetailPage({ params }: EstimateDetailPageProps) {
  const { estimateId } = await params;
  const id = parsePositiveIntId(estimateId);

  if (id === null) {
    notFound();
  }

  return (
    <CustomerAuthGate
      loadingFallback={
        <EstimateDetailLoadingState
          backFallbackHref={APP_ROUTES.ESTIMATES.RECEIVED}
          contentClassName={ESTIMATE_DETAIL_LAYOUT_CLASSES.contentClassName}
          rowClassName={ESTIMATE_DETAIL_LAYOUT_CLASSES.rowClassName}
          mainClassName={ESTIMATE_DETAIL_LAYOUT_CLASSES.mainClassName}
          asideClassName={cn(ESTIMATE_DETAIL_LAYOUT_CLASSES.asideClassName, "xl:pt-40")}
        />
      }
    >
      <EstimateDetailView estimateId={id} />
    </CustomerAuthGate>
  );
}
