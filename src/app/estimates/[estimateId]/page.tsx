import type { Metadata } from "next";
import { notFound } from "next/navigation";

import CustomerAuthGate from "@/components/auth/CustomerAuthGate";
import EstimateDetailView from "@/components/estimate/detail/EstimateDetailView";
import { FALLBACK_ESTIMATE_METADATA, generateReceivedEstimateMetadata } from "@/lib/share/metadata";
import { parsePositiveIntId } from "@/lib/utils/parsePositiveIntId";

interface EstimateDetailPageProps {
  params: Promise<{ estimateId: string }>;
}

export async function generateMetadata({ params }: EstimateDetailPageProps): Promise<Metadata> {
  const { estimateId } = await params;
  const id = parsePositiveIntId(estimateId);

  if (id === null) {
    return FALLBACK_ESTIMATE_METADATA;
  }

  return generateReceivedEstimateMetadata(id, `/estimates/${id}`);
}

// 2026.07.24 정슬기 - [수정] 상세 라우트를 /estimates/[estimateId]로 정리하고 API 연동 뷰에 연결
// 2026.07.31 정슬기 - [수정] notFound 시 AuthGate 미마운트 → 404 유지
export default async function EstimateDetailPage({ params }: EstimateDetailPageProps) {
  const { estimateId } = await params;
  const id = parsePositiveIntId(estimateId);

  if (id === null) {
    notFound();
  }

  return (
    <CustomerAuthGate loadingMessage="견적 관리를 불러오는 중입니다.">
      <EstimateDetailView estimateId={id} />
    </CustomerAuthGate>
  );
}
