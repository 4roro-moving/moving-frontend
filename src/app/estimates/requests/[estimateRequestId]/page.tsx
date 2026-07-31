import type { Metadata } from "next";
import { notFound } from "next/navigation";

import CustomerAuthGate from "@/components/auth/CustomerAuthGate";
import EstimateRequestDetailView from "@/components/estimate/requests/EstimateRequestDetailView";

interface EstimateRequestDetailPageProps {
  params: Promise<{ estimateRequestId: string }>;
}

export const metadata: Metadata = {
  title: "견적 상세",
  description: "보낸 견적 요청의 상세 정보를 확인합니다.",
};

// 2026.07.29 정슬기 - [추가] 보낸 견적 요청 상세 라우트
// 2026.07.31 정슬기 - [수정] notFound 시 AuthGate 미마운트 → 404 유지
export default async function EstimateRequestDetailPage({
  params,
}: EstimateRequestDetailPageProps) {
  const { estimateRequestId } = await params;
  const id = Number(estimateRequestId);

  if (!Number.isInteger(id) || id <= 0) {
    notFound();
  }

  return (
    <CustomerAuthGate loadingMessage="견적 관리를 불러오는 중입니다.">
      <EstimateRequestDetailView estimateRequestId={id} />
    </CustomerAuthGate>
  );
}
