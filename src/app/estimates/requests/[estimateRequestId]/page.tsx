import type { Metadata } from "next";
import { notFound } from "next/navigation";

import CustomerAuthGate from "@/components/auth/CustomerAuthGate";
import { EstimateRequestDetailSkeleton } from "@/components/estimate/requests/EstimateRequestLoadingSkeletons";
import EstimateRequestDetailView from "@/components/estimate/requests/EstimateRequestDetailView";
import { parsePositiveIntId } from "@/lib/utils/parsePositiveIntId";

export const metadata: Metadata = {
  title: "견적 상세",
  description: "이사 견적 상세 정보를 확인하세요.",
};

interface EstimateRequestDetailPageProps {
  params: Promise<{ estimateRequestId: string }>;
}

// 2026.07.29 정슬기 - [추가] 보낸 견적 요청 상세 라우트
// 2026.07.31 정슬기 - [수정] notFound 시 AuthGate 미마운트 → 404 유지
// 2026.08.10 정슬기 - [수정] 인증 확인 중에도 상세 Skeleton 노출
export default async function EstimateRequestDetailPage({
  params,
}: EstimateRequestDetailPageProps) {
  const { estimateRequestId } = await params;
  const id = parsePositiveIntId(estimateRequestId);

  if (id === null) {
    notFound();
  }

  return (
    <CustomerAuthGate loadingFallback={<EstimateRequestDetailSkeleton />}>
      <EstimateRequestDetailView estimateRequestId={id} />
    </CustomerAuthGate>
  );
}
