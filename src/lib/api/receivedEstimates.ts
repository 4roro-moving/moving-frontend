import fetchInstance from "@/lib/api/fetchInstance";
import { API_ROUTES } from "@/lib/constants/apiRoutes";
import type { EstimateDetail, ReceivedEstimatePanel } from "@/types/estimate";

/**
 * 받은 견적(받았던 견적) API
 * BE: GET /estimates/received, GET /estimates/:id, POST /estimates/:id/confirm
 * // 2026.07.24 정슬기 - [추가]
 * // 2026.07.28 정슬기 - [수정] axios → fetchInstance (Bearer·cookie refresh 계약 동일)
 */
export async function fetchReceivedEstimatePanels(): Promise<ReceivedEstimatePanel[]> {
  return fetchInstance.get<ReceivedEstimatePanel[]>(API_ROUTES.ESTIMATES.RECEIVED);
}

export async function fetchReceivedEstimateDetail(estimateId: number): Promise<EstimateDetail> {
  return fetchInstance.get<EstimateDetail>(API_ROUTES.ESTIMATES.DETAIL(estimateId));
}

/**
 * 견적 확정 — BE Router/Swagger 기준 POST /estimates/:estimateId/confirm
 * (중첩 경로 PATCH /estimate-requests/:requestId/estimates/:id/confirm 은 별도)
 */
export async function confirmReceivedEstimate(estimateId: number): Promise<EstimateDetail> {
  return fetchInstance.post<EstimateDetail>(API_ROUTES.ESTIMATES.CONFIRM(estimateId));
}
