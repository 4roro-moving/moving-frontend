import type { Metadata } from "next";

import CustomerAuthGate from "@/components/auth/CustomerAuthGate";
import { PendingEstimatesLoadingSkeleton } from "@/components/estimate/EstimateLoadingSkeletons";
import PendingEstimatesPageClient from "@/components/estimate/pending/PendingEstimatesPageClient";

export const metadata: Metadata = {
  title: "대기 중인 견적",
  description: "아직 확정되지 않은 대기 중인 견적 목록을 확인합니다.",
};

export default function PendingEstimatesPage() {
  return (
    <CustomerAuthGate loadingFallback={<PendingEstimatesLoadingSkeleton />}>
      <PendingEstimatesPageClient />
    </CustomerAuthGate>
  );
}
