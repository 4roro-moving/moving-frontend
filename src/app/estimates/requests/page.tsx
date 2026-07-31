import type { Metadata } from "next";

import CustomerAuthGate from "@/components/auth/CustomerAuthGate";
import EstimateRequestsPageClient from "@/components/estimate/requests/EstimateRequestsPageClient";

// 2026.07.29 정슬기 - [추가] 보낸 견적 요청 목록 페이지
export const metadata: Metadata = {
  title: "보낸 견적 요청",
  description: "내가 등록한 견적 요청 목록을 확인합니다.",
};

export default function EstimateRequestsPage() {
  return (
    <CustomerAuthGate loadingMessage="견적 관리를 불러오는 중입니다.">
      <EstimateRequestsPageClient />
    </CustomerAuthGate>
  );
}
