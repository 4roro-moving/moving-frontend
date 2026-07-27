import axiosInstance from "@/lib/api/axiosInstance";
import { API_ROUTES } from "@/lib/constants/apiRoutes";
import type { AddressSearchItem } from "@/lib/kakao/addressSearch";
import { normalizeRoadAddress } from "@/lib/kakao/addressSearch";
import { formatDateToISODate } from "@/lib/utils/date";

export type MoveType = "SMALL" | "HOME" | "OFFICE";

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

export interface CreateEstimateRequestResponse {
  success: boolean;
  data?: unknown;
  message?: string;
  error?: {
    code?: string;
    message?: string;
  };
}

const MOVE_TYPE_MAP = {
  small: "SMALL",
  home: "HOME",
  office: "OFFICE",
} as const satisfies Record<string, MoveType>;

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
  moveTypeId: keyof typeof MOVE_TYPE_MAP;
  moveDate: Date;
  from: AddressSearchItem;
  to: AddressSearchItem;
}): CreateEstimateRequestPayload {
  return {
    moveType: MOVE_TYPE_MAP[params.moveTypeId],
    moveDate: formatDateToISODate(params.moveDate),
    from: toEstimateAddressPayload(params.from),
    to: toEstimateAddressPayload(params.to),
  };
}

export async function createEstimateRequest(
  payload: CreateEstimateRequestPayload,
): Promise<CreateEstimateRequestResponse> {
  const { data } = await axiosInstance.post<CreateEstimateRequestResponse>(
    API_ROUTES.ESTIMATE_REQUESTS,
    payload,
  );

  if (!data.success) {
    throw new Error(data.error?.message || data.message || "견적 요청이 실패하였습니다.");
  }

  return data;
}

export interface ActiveEstimateRequestResponse {
  success: boolean;
  data: unknown | null;
  message?: string;
  error?: {
    code?: string;
    message?: string;
  };
}

/** 진행 중인 견적 요청 조회 — 없으면 null */
export async function getActiveEstimateRequest(): Promise<unknown | null> {
  const { data } = await axiosInstance.get<ActiveEstimateRequestResponse>(
    API_ROUTES.ESTIMATE_REQUEST_ACTIVE,
  );

  if (!data.success) {
    throw new Error(data.error?.message || data.message || "진행 중인 견적 조회에 실패했습니다.");
  }

  return data.data ?? null;
}
