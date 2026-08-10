import type { Metadata } from "next";

import CustomerAuthGate from "@/components/auth/CustomerAuthGate";
import ReceivedEstimatesPageClient from "@/components/estimate/received/ReceivedEstimatesPageClient";

export const metadata: Metadata = {
  title: "받았던 견적",
  description: "요청한 이사에 대해 받은 견적 목록을 확인하고 비교합니다.",
};

export default function ReceivedEstimatesPage() {
  return (
    <CustomerAuthGate>
      <ReceivedEstimatesPageClient />
    </CustomerAuthGate>
  );
}
