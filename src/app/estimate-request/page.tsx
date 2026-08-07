import CustomerAuthGate from "@/components/auth/CustomerAuthGate";
import EstimateRequestForm from "@/components/estimate/request/EstimateRequestForm";

export default function EstimateRequestPage() {
  return (
    <CustomerAuthGate loadingMessage="견적 요청을 준비하는 중입니다.">
      <main className="bg-background-subtle min-h-screen md:px-40 md:py-64">
        <EstimateRequestForm />
      </main>
    </CustomerAuthGate>
  );
}
