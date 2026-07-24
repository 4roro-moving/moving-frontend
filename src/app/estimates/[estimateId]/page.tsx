import { notFound } from "next/navigation";

import EstimateDetailView from "@/components/estimate/detail/EstimateDetailView";

interface EstimateDetailPageProps {
  params: Promise<{ estimateId: string }>;
}

// 2026.07.24 정슬기 - [수정] 상세 라우트를 /estimates/[estimateId]로 정리하고 API 연동 뷰에 연결
export default async function EstimateDetailPage({ params }: EstimateDetailPageProps) {
  const { estimateId } = await params;
  const id = Number(estimateId);

  if (!Number.isFinite(id) || id <= 0) {
    notFound();
  }

  return <EstimateDetailView estimateId={id} />;
}
