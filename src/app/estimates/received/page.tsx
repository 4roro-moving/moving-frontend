import type { Metadata } from "next";

import CustomerAuthGate from "@/components/auth/CustomerAuthGate";
import { ReceivedEstimatesLoadingSkeleton } from "@/components/estimate/EstimateLoadingSkeletons";
import ReceivedEstimatesPageClient from "@/components/estimate/received/ReceivedEstimatesPageClient";

export const metadata: Metadata = {
  title: "받았던 견적",
  description: "요청한 이사에 대해 받은 견적 목록을 확인하고 비교합니다.",
};

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
