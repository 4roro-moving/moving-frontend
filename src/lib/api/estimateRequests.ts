import fetchInstance from "@/lib/api/fetchInstance";
import { API_ROUTES } from "@/lib/constants/apiRoutes";
import type {
  MyEstimateRequestItem,
  MyEstimateRequestListQuery,
  MyEstimateRequestListResult,
} from "@/types/estimate";

export const ESTIMATE_REQUEST_LIST_PAGE_LIMIT = 10;

/**
 * 고객이 보낸 견적 요청 목록
 * BE: GET /api/estimate-requests?page&limit
 * 응답: { success, data: MyEstimateRequestItem[], pagination }
 * // 2026.07.29 정슬기 - [추가] 보낸 견적 요청 목록 API
 */
export async function fetchMyEstimateRequestList(
  query: MyEstimateRequestListQuery = {},
): Promise<MyEstimateRequestListResult> {
  const page = query.page ?? 1;
  const limit = query.limit ?? ESTIMATE_REQUEST_LIST_PAGE_LIMIT;
  const params = new URLSearchParams({
    page: String(page),
    limit: String(limit),
  });

  const result = await fetchInstance.getPaginated<MyEstimateRequestItem[]>(
    `${API_ROUTES.ESTIMATE_REQUESTS.ROOT}?${params.toString()}`,
  );

  return {
    estimateRequests: result.data,
    pagination: result.pagination,
  };
}
