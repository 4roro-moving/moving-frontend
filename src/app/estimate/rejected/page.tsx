import type { Metadata } from "next";

import MoverAuthGate from "@/components/auth/MoverAuthGate";
import RejectedRequestsPage from "@/components/estimate/RejectedRequestsPage";

export const metadata: Metadata = {
  title: "반려 요청",
  description: "기사님이 반려한 견적 요청과 반려 사유 확인",
};

export default function RejectedRequestsRoute() {
  return (
    <MoverAuthGate loadingMessage="반려 요청을 불러오는 중입니다.">
      <RejectedRequestsPage />
    </MoverAuthGate>
  );
}
