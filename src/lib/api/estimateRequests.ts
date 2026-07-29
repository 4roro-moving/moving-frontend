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
 * BE: GET /api/estimate-requests?page&limit&status?
 * 정렬: BE createdAt DESC, id DESC (프론트 재정렬 없음)
 * 응답: { success, data: MyEstimateRequestItem[], pagination }
 * // 2026.07.29 정슬기 - [추가] 보낸 견적 요청 목록 API
 * // 2026.07.29 정슬기 - [수정] optional status query 연결
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

  // 전체 조회 시 status 미전달
  if (query.status !== undefined) {
    params.set("status", query.status);
  }

  const result = await fetchInstance.getPaginated<MyEstimateRequestItem[]>(
    `${API_ROUTES.ESTIMATE_REQUESTS.ROOT}?${params.toString()}`,
  );

  return {
    estimateRequests: result.data,
    pagination: result.pagination,
  };
}

/**
 * 보낸 견적 요청 상세
 * BE: GET /api/estimate-requests/:estimateRequestId
 * 응답 data 형태는 목록 아이템(MyEstimateRequestItem)과 동일
 * // 2026.07.29 정슬기 - [추가]
 */
export async function fetchEstimateRequestDetail(
  estimateRequestId: number,
): Promise<MyEstimateRequestItem> {
  return fetchInstance.get<MyEstimateRequestItem>(
    API_ROUTES.ESTIMATE_REQUESTS.DETAIL(estimateRequestId),
  );
}
