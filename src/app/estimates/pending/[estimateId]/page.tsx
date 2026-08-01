import type { Metadata } from "next";
import { notFound } from "next/navigation";

import CustomerAuthGate from "@/components/auth/CustomerAuthGate";
import PendingEstimateDetailView from "@/components/estimate/pending/PendingEstimateDetailView";
import { parsePositiveIntId } from "@/lib/utils/parsePositiveIntId";

export const metadata: Metadata = {
  title: "견적 상세",
  description: "이사 견적 상세 정보를 확인하세요.",
};

interface PendingEstimateDetailPageProps {
  params: Promise<{ estimateId: string }>;
}

// 2026.07.25 정슬기 - [추가] /estimates/pending/[estimateId] — 받은 견적 상세와 라우트 분리
// 2026.07.31 정슬기 - [수정] notFound 시 AuthGate 미마운트 → 404 유지
export default async function PendingEstimateDetailPage({
  params,
}: PendingEstimateDetailPageProps) {
  const { estimateId } = await params;
  const id = parsePositiveIntId(estimateId);

  if (id === null) {
    notFound();
  }

  return (
    <CustomerAuthGate loadingMessage="견적 관리를 불러오는 중입니다.">
      <PendingEstimateDetailView estimateId={id} />
    </CustomerAuthGate>
  );
}
