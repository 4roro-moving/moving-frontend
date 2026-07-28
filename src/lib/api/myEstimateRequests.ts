import { confirmReceivedEstimate, fetchReceivedEstimateDetail } from "@/lib/api/receivedEstimates";
import fetchInstance from "@/lib/api/fetchInstance";
import { API_ROUTES } from "@/lib/constants/apiRoutes";
import type {
  MyEstimateRequestListQuery,
  PendingEstimateDetailViewModel,
  PendingEstimateSection,
  PendingEstimateSectionListResult,
} from "@/types/estimate";

export const PENDING_ESTIMATE_PAGE_LIMIT = 10;

/**
 * 대기 중인 견적 목록
 * BE: GET /api/estimates/pending?page&limit
 * 응답: { success, data: sections[], pagination }
 * // 2026.07.28 정슬기 - [수정] mock → 실 API 연동
 */
export async function fetchPendingEstimateSections(
  query: MyEstimateRequestListQuery = {},
): Promise<PendingEstimateSectionListResult> {
  const page = query.page ?? 1;
  const limit = query.limit ?? PENDING_ESTIMATE_PAGE_LIMIT;
  const params = new URLSearchParams({
    page: String(page),
    limit: String(limit),
  });

  const result = await fetchInstance.getPaginated<PendingEstimateSection[]>(
    `${API_ROUTES.ESTIMATES.PENDING}?${params.toString()}`,
  );

  return {
    sections: result.data,
    pagination: result.pagination,
  };
}

/**
 * 대기 견적 상세 — 받은 견적 상세와 동일 계약 (GET /estimates/:estimateId)
 */
export async function fetchPendingEstimateDetail(
  estimateId: number,
): Promise<PendingEstimateDetailViewModel> {
  return fetchReceivedEstimateDetail(estimateId);
}

/**
 * 대기 목록/상세 확정 — POST /estimates/:estimateId/confirm
 */
export async function confirmPendingEstimate(
  estimateId: number,
): Promise<PendingEstimateDetailViewModel> {
  return confirmReceivedEstimate(estimateId);
}

/** 대기 상세 확정 — confirmPendingEstimate와 동일 */
export async function confirmPendingEstimateDetail(
  estimateId: number,
): Promise<PendingEstimateDetailViewModel> {
  return confirmPendingEstimate(estimateId);
}
