import type {
  MoverEstimateRequestQuery,
  MoverEstimateRequestResponse,
  RejectEstimateRequest,
  RejectEstimateResponse,
  RejectedEstimateRequestListResponse,
  SendEstimateRequest,
  SendEstimateResponse,
} from "@/types/moverEstimateRequest";

import { API_ROUTES } from "../constants/apiRoutes";
import axiosInstance from "./axiosInstance";

// 기사 견적 요청 목록 조회
// GET /api/estimates/requests
export async function getMoverEstimateRequests(query: MoverEstimateRequestQuery) {
  const params = new URLSearchParams();

  params.set("limit", String(query.limit));
  params.set("sort", query.sort);

  //다음 페이지 조회 기준
  if (query.cursor) params.set("cursor", query.cursor);
  //키워드
  if (query.keyword) params.set("keyword", query.keyword);
  //지정 견적 요청 여부
  if (query.isDesignated !== undefined) {
    params.set("isDesignated", String(query.isDesignated));
  }
  //서비스 가능 지역
  if (query.isServiceArea !== undefined) {
    params.set("isServiceArea", String(query.isServiceArea));
  }
  //이사 유형 필터
  query.moveType?.forEach((moveType) => params.append("moveType", moveType));

  const response = await axiosInstance.get<MoverEstimateRequestResponse>(
    `/api${API_ROUTES.ESTIMATES.ROOT}/requests?${params.toString()}`,
  );

  if (!response.data.success) {
    throw new Error(response.data.error.code);
  }

  return response.data.data;
}

// 기사가 고객의 견적 요청에 견적 전송
// POST /api/estimates/requests/:estimateRequestId
export async function sendMoverEstimate(estimateRequestId: number, input: SendEstimateRequest) {
  const response = await axiosInstance.post<SendEstimateResponse>(
    `/api${API_ROUTES.ESTIMATES.ROOT}/requests/${estimateRequestId}`,
    input,
  );

  if (!response.data.success) {
    throw new Error(response.data.error.message);
  }

  return response.data.data;
}

// 기사 견적 반려
// POST /api/estimates/requests/:id/reject
export async function rejectMoverEstimate(estimateRequestId: number, input: RejectEstimateRequest) {
  const response = await axiosInstance.post<RejectEstimateResponse>(
    `/api${API_ROUTES.ESTIMATES.ROOT}/requests/${estimateRequestId}/reject`,
    input,
  );

  if (!response.data.success) {
    throw new Error(response.data.error.message);
  }

  return response.data.data;
}

//기사님 반려 내역 조회
//GET /api/estimates/rejections
export async function getRejectedEstimateRequests(cursor?: string, limit = 10) {
  const params = new URLSearchParams({ limit: String(limit) });
  if (cursor) params.set("cursor", cursor);

  const response = await axiosInstance.get<RejectedEstimateRequestListResponse>(
    `/api${API_ROUTES.ESTIMATES.ROOT}/rejections?${params.toString()}`,
  );

  if (!response.data.success) {
    throw new Error(response.data.error.message);
  }

  return response.data.data;
}
