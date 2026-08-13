import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Suspense } from "react";

import CustomerAuthGate from "@/components/auth/CustomerAuthGate";
import {
  ESTIMATE_DETAIL_LAYOUT_CLASSES,
  EstimateDetailLoadingState,
} from "@/components/estimate/detail/EstimateDetailLayout";
import PendingEstimateDetailView from "@/components/estimate/pending/PendingEstimateDetailView";
import { APP_ROUTES } from "@/lib/constants/appRoutes";
import { cn } from "@/lib/utils/cn";
import { parsePositiveIntId } from "@/lib/utils/parsePositiveIntId";

export const metadata: Metadata = {
  title: "견적 상세",
  description: "이사 견적 상세 정보를 확인하세요.",
};

interface PendingEstimateDetailPageProps {
  params: Promise<{ estimateId: string }>;
}

export default async function PendingEstimateDetailPage({
  params,
}: PendingEstimateDetailPageProps) {
  const { estimateId } = await params;
  const id = parsePositiveIntId(estimateId);

  if (id === null) {
    notFound();
  }

  const loadingFallback = (
    <EstimateDetailLoadingState
      backFallbackHref={APP_ROUTES.ESTIMATES.PENDING}
      contentClassName={cn(ESTIMATE_DETAIL_LAYOUT_CLASSES.contentClassName, "pt-28")}
      rowClassName={ESTIMATE_DETAIL_LAYOUT_CLASSES.rowClassName}
      mainClassName={ESTIMATE_DETAIL_LAYOUT_CLASSES.mainClassName}
      asideClassName={cn(ESTIMATE_DETAIL_LAYOUT_CLASSES.asideClassName, "xl:gap-80 xl:pt-40")}
    />
  );

  return (
    <Suspense fallback={loadingFallback}>
      <CustomerAuthGate loadingFallback={loadingFallback}>
        <PendingEstimateDetailView estimateId={id} />
      </CustomerAuthGate>
    </Suspense>
  );
}
