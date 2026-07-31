import type { Metadata } from "next";
import { notFound } from "next/navigation";

import EstimateRequestDetailView from "@/components/estimate/requests/EstimateRequestDetailView";
import { fetchEstimateRequestDetail } from "@/lib/api/estimateRequests";
import { buildEstimateDetailMetadata, FALLBACK_ESTIMATE_METADATA } from "@/lib/share/metadata";
import { parsePositiveIntId } from "@/lib/utils/parsePositiveIntId";
import { ApiError } from "@/types/api";

interface EstimateRequestDetailPageProps {
  params: Promise<{ estimateRequestId: string }>;
}

export async function generateMetadata({
  params,
}: EstimateRequestDetailPageProps): Promise<Metadata> {
  const { estimateRequestId } = await params;
  const id = parsePositiveIntId(estimateRequestId);

  if (id === null) {
    return FALLBACK_ESTIMATE_METADATA;
  }

  try {
    await fetchEstimateRequestDetail(id);

    return buildEstimateDetailMetadata({
      path: `/estimates/requests/${id}`,
      moverName: null,
      profileImageUrl: null,
      imageAlt: "이사 견적 요청",
    });
  } catch (error) {
    if (error instanceof ApiError && (error.status === 404 || error.status === 403)) {
      return {
        title: "견적 요청을 찾을 수 없습니다",
        description: "요청하신 견적 정보를 찾을 수 없습니다.",
      };
    }

    return FALLBACK_ESTIMATE_METADATA;
  }
}

// 2026.07.29 정슬기 - [추가] 보낸 견적 요청 상세 라우트
export default async function EstimateRequestDetailPage({
  params,
}: EstimateRequestDetailPageProps) {
  const { estimateRequestId } = await params;
  const id = parsePositiveIntId(estimateRequestId);

  if (id === null) {
    notFound();
  }

  return <EstimateRequestDetailView estimateRequestId={id} />;
}
