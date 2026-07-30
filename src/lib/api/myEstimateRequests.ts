import fetchInstance from "@/lib/api/fetchInstance";
import { API_ROUTES } from "@/lib/constants/apiRoutes";
import type {
  MyEstimateRequestListQuery,
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
