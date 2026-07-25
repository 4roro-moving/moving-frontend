import {
  confirmMockPendingEstimate,
  getMockPendingEstimateDetail,
  MOCK_MY_ESTIMATE_REQUESTS,
  MOCK_PENDING_ESTIMATES_BY_REQUEST_ID,
} from "@/lib/mocks/myEstimateRequests.mock";
import { buildMockPagination } from "@/lib/mocks/pagination";
import type {
  MyEstimateRequestListQuery,
  MyEstimateRequestListResult,
  MyPendingEstimateOffer,
  PendingEstimateDetailViewModel,
  PendingEstimateSection,
  PendingEstimateSectionListResult,
} from "@/types/estimate";

const DEFAULT_PAGE = 1;
const DEFAULT_LIMIT = 10;

/**
 * 내 견적 요청 목록 service (API 계약)
 * 현재는 mock을 반환하며, 이후 axios API 호출로 교체하면 됩니다.
 * // 2026.07.25 정슬기 - [추가] 내 견적 요청 mock service
 */
export async function fetchMyEstimateRequests(
  query: MyEstimateRequestListQuery = {},
): Promise<MyEstimateRequestListResult> {
  const page = query.page ?? DEFAULT_PAGE;
  const limit = query.limit ?? DEFAULT_LIMIT;

  // TODO: 실제 API 연동 시
  // const { data } = await axiosInstance.get<PaginatedApiSuccessResponse<MyEstimateRequestItem[]>>(
  //   API_ROUTES.ESTIMATE_REQUESTS.ROOT,
  //   { params: { page, limit } },
  // );
  // return { estimateRequests: data.data, pagination: data.pagination };

  await Promise.resolve();

  const start = (page - 1) * limit;
  const estimateRequests = MOCK_MY_ESTIMATE_REQUESTS.slice(start, start + limit);

  return {
    estimateRequests,
    pagination: buildMockPagination(MOCK_MY_ESTIMATE_REQUESTS.length, page, limit),
  };
}

function toPendingEstimateSections(
  estimateRequests: MyEstimateRequestListResult["estimateRequests"],
): PendingEstimateSection[] {
  return estimateRequests.map((request) => ({
    request,
    estimates: MOCK_PENDING_ESTIMATES_BY_REQUEST_ID[request.id] ?? [],
  }));
}

/**
 * 대기 중 견적 목록 UI ViewModel
 * API 계약은 `fetchMyEstimateRequests`로 유지하고, UI용으로만 변환합니다.
 * // 2026.07.25 정슬기 - [추가] PendingEstimateSection ViewModel 조립
 */
export async function fetchPendingEstimateSections(
  query: MyEstimateRequestListQuery = {},
): Promise<PendingEstimateSectionListResult> {
  const result = await fetchMyEstimateRequests(query);

  return {
    sections: toPendingEstimateSections(result.estimateRequests),
    pagination: result.pagination,
  };
}

/**
 * 대기 목록 견적 확정 (프론트 mock)
 * TODO: 백엔드 연동 시 confirmReceivedEstimate(estimateId)로 교체
 * // 2026.07.25 정슬기 - [추가] mock confirm — 실제 API 미호출
 */
export async function confirmPendingEstimate(estimateId: number): Promise<MyPendingEstimateOffer> {
  await Promise.resolve();
  return confirmMockPendingEstimate(estimateId);
}

/**
 * 대기 견적 상세 ViewModel
 * TODO: 백엔드 연동 시 GET /estimates/:id 등으로 교체하되, received service와 분리 유지
 * // 2026.07.25 정슬기 - [추가] pending detail mock service
 */
export async function fetchPendingEstimateDetail(
  estimateId: number,
): Promise<PendingEstimateDetailViewModel> {
  await Promise.resolve();
  return getMockPendingEstimateDetail(estimateId);
}

/**
 * 대기 견적 상세 확정 후 최신 ViewModel 반환 (mock)
 * // 2026.07.25 정슬기 - [추가] pending detail confirm → ViewModel 재조립
 */
export async function confirmPendingEstimateDetail(
  estimateId: number,
): Promise<PendingEstimateDetailViewModel> {
  await confirmPendingEstimate(estimateId);
  return getMockPendingEstimateDetail(estimateId);
}
