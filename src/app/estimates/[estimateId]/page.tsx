import type { Metadata } from "next";
import { notFound } from "next/navigation";

import EstimateDetailView from "@/components/estimate/detail/EstimateDetailView";

interface EstimateDetailPageProps {
  params: Promise<{ estimateId: string }>;
}

export const metadata: Metadata = {
  // 2026.07.24 정슬기 - [추가] 견적 상세 페이지 metadata
  title: "견적 상세",
  description: "기사님 견적 상세 정보와 확정 여부를 확인합니다.",
};

// 2026.07.24 정슬기 - [수정] 상세 라우트를 /estimates/[estimateId]로 정리하고 API 연동 뷰에 연결
export default async function EstimateDetailPage({ params }: EstimateDetailPageProps) {
  const { estimateId } = await params;
  const id = Number(estimateId);

  if (!Number.isInteger(id) || id <= 0) {
    notFound();
  }

  return <EstimateDetailView estimateId={id} />;
}
