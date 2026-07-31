import type { Metadata } from "next";

import CustomerAuthGate from "@/components/auth/CustomerAuthGate";
import PendingEstimatesPageClient from "@/components/estimate/pending/PendingEstimatesPageClient";

export const metadata: Metadata = {
  // 2026.07.31 정슬기 - [추가] 대기 중인 견적 목록 metadata
  title: "대기 중인 견적",
  description: "아직 확정하지 않은 대기 중인 견적 목록을 확인합니다.",
};

export default function PendingEstimatesPage() {
  return (
    <CustomerAuthGate loadingMessage="견적 관리를 불러오는 중입니다.">
      <PendingEstimatesPageClient />
    </CustomerAuthGate>
  );
}
