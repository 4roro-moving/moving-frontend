import axiosInstance from "@/lib/api/axiosInstance";
import { API_ROUTES } from "@/lib/constants/apiRoutes";
import type { EstimateDetail, ReceivedEstimatePanel } from "@/types/estimate";

interface ApiSuccessResponse<T> {
  success: true;
  data: T;
}

// 2026.07.24 정슬기 - [추가] 받은 견적 목록 API 연동
export async function fetchReceivedEstimatePanels(): Promise<ReceivedEstimatePanel[]> {
  const { data } = await axiosInstance.get<ApiSuccessResponse<ReceivedEstimatePanel[]>>(
    API_ROUTES.ESTIMATES.RECEIVED,
  );
  return data.data;
}

// 2026.07.24 정슬기 - [추가] estimateId 기준 견적 상세 API 연동
export async function fetchReceivedEstimateDetail(estimateId: number): Promise<EstimateDetail> {
  const { data } = await axiosInstance.get<ApiSuccessResponse<EstimateDetail>>(
    API_ROUTES.ESTIMATES.DETAIL(estimateId),
  );
  return data.data;
}

// 2026.07.24 정슬기 - [추가] 견적 확정 API 호출
export async function confirmReceivedEstimate(estimateId: number): Promise<EstimateDetail> {
  const { data } = await axiosInstance.post<ApiSuccessResponse<EstimateDetail>>(
    API_ROUTES.ESTIMATES.CONFIRM(estimateId),
  );
  return data.data;
}
