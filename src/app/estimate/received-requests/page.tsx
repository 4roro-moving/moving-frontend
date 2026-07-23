import ReceivedRequestsHeader from "@/components/estimate/ReceivedRequestsHeader";
import ReceivedRequestsPage from "@/components/estimate/ReceivedRequestsPage";

export default function Page() {
  return (
    <div className="bg-background-default text-text-primary min-h-screen">
      <ReceivedRequestsHeader />
      <ReceivedRequestsPage />
    </div>
  );
}
