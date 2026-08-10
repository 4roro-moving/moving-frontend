import MoverAuthGate from "@/components/auth/MoverAuthGate";
import ReceivedRequestsPage from "@/components/estimate/ReceivedRequestsPage";
import { ReceivedRequestsPageSkeleton } from "@/components/estimate/ReceivedRequestsSkeleton";

export default function Page() {
  return (
    <MoverAuthGate loadingFallback={<ReceivedRequestsPageSkeleton />}>
      <div className="bg-background-default text-text-primary min-h-screen">
        <ReceivedRequestsPage />
      </div>
    </MoverAuthGate>
  );
}
