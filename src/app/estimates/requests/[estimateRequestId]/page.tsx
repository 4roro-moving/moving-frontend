import type { Metadata } from "next";
import { notFound } from "next/navigation";

import EstimateRequestDetailView from "@/components/estimate/requests/EstimateRequestDetailView";

interface EstimateRequestDetailPageProps {
  params: Promise<{ estimateRequestId: string }>;
}

export const metadata: Metadata = {
  title: "견적 상세",
  description: "보낸 견적 요청의 상세 정보를 확인합니다.",
};

// 2026.07.29 정슬기 - [추가] 보낸 견적 요청 상세 라우트
export default async function EstimateRequestDetailPage({
  params,
}: EstimateRequestDetailPageProps) {
  const { estimateRequestId } = await params;
  const id = Number(estimateRequestId);

  if (!Number.isInteger(id) || id <= 0) {
    notFound();
  }

  return <EstimateRequestDetailView estimateRequestId={id} />;
}
