import type { Metadata } from "next";
import { notFound } from "next/navigation";

import CustomerAuthGate from "@/components/auth/CustomerAuthGate";
import EstimateDetailView from "@/components/estimate/detail/EstimateDetailView";
import { parsePositiveIntId } from "@/lib/utils/parsePositiveIntId";

export const metadata: Metadata = {
  title: "견적 상세",
  description: "이사 견적 상세 정보를 확인하세요.",
};

interface EstimateDetailPageProps {
  params: Promise<{ estimateId: string }>;
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
