import type { Metadata } from "next";

import CustomerAuthGate from "@/components/auth/CustomerAuthGate";
import RejectedRequestsPage from "@/components/estimate/RejectedRequestsPage";

export const metadata: Metadata = {
  title: "반려 요청",
  description: "기사님이 반려한 견적 요청과 반려 사유 확인",
};

export default function RejectedRequestsRoute() {
  return (
    <CustomerAuthGate loadingMessage="견적 관리를 불러오는 중입니다.">
      <RejectedRequestsPage />
    </CustomerAuthGate>
  );
}
