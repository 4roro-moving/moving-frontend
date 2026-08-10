import type { Metadata } from "next";

import MoverAuthGate from "@/components/auth/MoverAuthGate";
import MoverEstimateListPageSkeleton from "@/components/estimate/MoverEstimateListSkeleton";
import SentEstimatesPage from "@/components/estimate/sent/SentEstimatesPage";

export const metadata: Metadata = {
  title: "보낸 견적 조회",
  description: "기사님이 보낸 견적과 확정된 견적을 확인합니다.",
};

export default function SentEstimatesRoute() {
  return (
    <MoverAuthGate loadingFallback={<MoverEstimateListPageSkeleton />}>
      <SentEstimatesPage />
    </MoverAuthGate>
  );
}
