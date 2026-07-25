import type { Metadata } from "next";
import { notFound } from "next/navigation";

import PendingEstimateDetailView from "@/components/estimate/pending/PendingEstimateDetailView";

interface PendingEstimateDetailPageProps {
  params: Promise<{ estimateId: string }>;
}

export const metadata: Metadata = {
  // 2026.07.25 정슬기 - [추가] 대기 견적 상세 metadata
  title: "견적 상세",
  description: "대기 중인 견적 상세 정보와 확정 여부를 확인합니다.",
};

// 2026.07.25 정슬기 - [추가] /estimates/pending/[estimateId] — 받은 견적 상세와 라우트 분리
export default async function PendingEstimateDetailPage({
  params,
}: PendingEstimateDetailPageProps) {
  const { estimateId } = await params;
  const id = Number(estimateId);

  if (!Number.isInteger(id) || id <= 0) {
    notFound();
  }

  return <PendingEstimateDetailView estimateId={id} />;
}
