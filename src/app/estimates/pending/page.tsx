import CustomerAuthGate from "@/components/auth/CustomerAuthGate";
import PendingEstimatesPageClient from "@/components/estimate/pending/PendingEstimatesPageClient";

export default function PendingEstimatesPage() {
  return (
    <CustomerAuthGate loadingMessage="견적 관리를 불러오는 중입니다.">
      <PendingEstimatesPageClient />
    </CustomerAuthGate>
  );
}
