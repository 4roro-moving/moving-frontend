import fetchInstance from "@/lib/api/fetchInstance";
import { API_ROUTES } from "@/lib/constants/apiRoutes";
import type { SentEstimate, SentEstimateDisplayStatus } from "@/types/sentEstimate";

export interface SentEstimateListQuery {
  page?: number;
  limit?: number;
  status?: SentEstimateDisplayStatus;
}

//보낸 견적 목록 조회
export async function fetchSentEstimates(query: SentEstimateListQuery) {
  const params = new URLSearchParams({
    page: String(query.page ?? 1),
    limit: String(query.limit ?? 6),
  });

  if (query.status) params.set("status", query.status);

  return fetchInstance.getPaginated<SentEstimate[]>(
    `${API_ROUTES.ESTIMATES.SENT}?${params.toString()}`,
  );
}

//특정 견적 하나의 상세 정보 조회
export function fetchSentEstimateDetail(estimateId: number): Promise<SentEstimate> {
  return fetchInstance.get<SentEstimate>(API_ROUTES.ESTIMATES.SENT_DETAIL(estimateId));
}
