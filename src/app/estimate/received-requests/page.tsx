import MoverAuthGate from "@/components/auth/MoverAuthGate";
import ReceivedRequestsPage from "@/components/estimate/ReceivedRequestsPage";

export default function Page() {
  return (
    <MoverAuthGate loadingMessage="받은 요청을 불러오는 중입니다.">
      <div className="bg-background-default text-text-primary min-h-screen">
        <ReceivedRequestsPage />
      </div>
    </MoverAuthGate>
  );
}
