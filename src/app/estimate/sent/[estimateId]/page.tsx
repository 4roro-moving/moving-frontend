import type { Metadata } from "next";
import { notFound } from "next/navigation";

import MoverAuthGate from "@/components/auth/MoverAuthGate";
import SentEstimateDetailPage from "@/components/estimate/sent/SentEstimateDetailPage";

export const metadata: Metadata = {
  title: "견적 상세",
  description: "기사님이 보낸 확정 견적의 상세 정보를 확인합니다.",
};

interface PageProps {
  params: Promise<{ estimateId: string }>;
}

export default async function SentEstimateDetailRoute({ params }: PageProps) {
  const { estimateId: estimateIdParam } = await params;
  const estimateId = Number(estimateIdParam);

  if (!Number.isSafeInteger(estimateId) || estimateId <= 0) {
    notFound();
  }

  return (
    <MoverAuthGate loadingMessage="보낸 견적을 불러오는 중입니다.">
      <SentEstimateDetailPage estimateId={estimateId} />
    </MoverAuthGate>
  );
}
