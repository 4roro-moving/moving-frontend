import type { Metadata } from "next";

import MoverAuthGate from "@/components/auth/MoverAuthGate";
import MoverEstimateListPageSkeleton from "@/components/estimate/MoverEstimateListSkeleton";
import RejectedRequestsPage from "@/components/estimate/RejectedRequestsPage";

export const metadata: Metadata = {
  title: "반려 요청",
  description: "기사님이 반려한 견적 요청과 반려 사유 확인",
};

export default function RejectedRequestsRoute() {
  return (
    <MoverAuthGate loadingFallback={<MoverEstimateListPageSkeleton />}>
      <RejectedRequestsPage />
    </MoverAuthGate>
  );
}
