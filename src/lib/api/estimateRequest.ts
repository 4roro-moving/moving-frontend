import fetchInstance from "@/lib/api/fetchInstance";
import { API_ROUTES } from "@/lib/constants/apiRoutes";
import type { AddressSearchItem } from "@/lib/kakao/addressSearch";
import { normalizeRoadAddress } from "@/lib/kakao/addressSearch";
import { formatDateToISODate } from "@/lib/utils/date";
import type { MyEstimateRequestItem } from "@/types/estimate";
import type { MoveType } from "@/types/move";

export interface EstimateAddressPayload {
  zipCode: string;
  address: string;
  detailAddress?: string;
  sido: string;
  sigungu?: string;
}

export interface CreateEstimateRequestPayload {
  moveType: MoveType;
  moveDate: string;
  from: EstimateAddressPayload;
  to: EstimateAddressPayload;
}

function extractSigungu(value: string): string | undefined {
  const parts = value.trim().split(/\s+/);
  return parts[1] || undefined;
}

/** 카카오 검색 결과를 백엔드 주소 스키마로 변환 */
export function toEstimateAddressPayload(item: AddressSearchItem): EstimateAddressPayload {
  const address = normalizeRoadAddress(item.roadAddress);
  const sigunguSource = item.jibunAddress || address;

  return {
    zipCode: item.zipCode,
    address,
    sido: item.sido,
    sigungu: extractSigungu(sigunguSource),
  };
}

export function buildCreateEstimateRequestPayload(params: {
  moveType: MoveType;
  moveDate: Date;
  from: AddressSearchItem;
  to: AddressSearchItem;
}): CreateEstimateRequestPayload {
  return {
    moveType: params.moveType,
    moveDate: formatDateToISODate(params.moveDate),
    from: toEstimateAddressPayload(params.from),
    to: toEstimateAddressPayload(params.to),
  };
}

export async function createEstimateRequest(
  payload: CreateEstimateRequestPayload,
): Promise<MyEstimateRequestItem> {
  return fetchInstance.post<MyEstimateRequestItem>(API_ROUTES.ESTIMATE_REQUESTS.ROOT, payload);
}

/** 진행 중인 견적 요청 조회 — 없으면 null */
export async function getActiveEstimateRequest(): Promise<MyEstimateRequestItem | null> {
  return fetchInstance.get<MyEstimateRequestItem | null>(API_ROUTES.ESTIMATE_REQUESTS.ACTIVE);
}

/** POST /estimate-requests/:id/designate — 지정 견적 요청 */
export async function designateMover(
  estimateRequestId: number,
  moverId: string,
): Promise<MyEstimateRequestItem> {
  return fetchInstance.post<MyEstimateRequestItem>(
    API_ROUTES.ESTIMATE_REQUESTS.DESIGNATE(estimateRequestId),
    { moverId },
  );
}
