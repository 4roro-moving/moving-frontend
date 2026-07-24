export type MoveType = "SMALL" | "HOME" | "OFFICE";

// 2026.07.24 정슬기 - [수정] Mock pending/confirmed 대신 백엔드 EstimateStatus 응답 구조 적용
export type EstimateStatus = "SENT" | "CONFIRMED" | "EXPIRED" | "CANCELED";

export type EstimateRequestStatus =
  "PENDING" | "OPEN" | "CONFIRMED" | "COMPLETED" | "EXPIRED" | "CANCELED";

/** UI 필터/표시용 */
export type EstimateOfferFilter = "all" | "confirmed" | "pending";

export interface EstimateMoverSummary {
  id: string;
  name: string;
  nickname: string | null;
  imageUrl: string | null;
  career: number;
  shortIntro: string | null;
  averageRating: number;
  reviewCount: number;
  confirmedCount: number;
  favoriteCount: number;
  isFavorite: boolean;
}

export interface ReceivedEstimateListItem {
  id: number;
  price: number;
  status: EstimateStatus;
  isDesignated: boolean;
  createdAt: string;
  mover: EstimateMoverSummary;
}

export interface ReceivedEstimateRequestSummary {
  id: number;
  moveType: MoveType;
  moveDate: string;
  fromAddress: string;
  toAddress: string;
  status: EstimateRequestStatus;
  createdAt: string;
  confirmedEstimateId: number | null;
}

// 2026.07.24 정슬기 - [수정] 받은 견적 패널을 실제 API 응답 구조로 정의
export interface ReceivedEstimatePanel {
  estimateRequest: ReceivedEstimateRequestSummary;
  estimates: ReceivedEstimateListItem[];
}

export interface EstimateDetailMover extends EstimateMoverSummary {
  description: string | null;
  serviceTypes: MoveType[];
  serviceAreas: { id: number; name: string }[];
}

export interface EstimateDetailRequest {
  id: number;
  moveType: MoveType;
  moveDate: string;
  fromZipCode: string;
  fromAddress: string;
  fromDetailAddress: string | null;
  fromRegion: { id: number; name: string };
  toZipCode: string;
  toAddress: string;
  toDetailAddress: string | null;
  toRegion: { id: number; name: string };
  status: EstimateRequestStatus;
  confirmedEstimateId: number | null;
}

// 2026.07.24 정슬기 - [수정] 상세 타입에 canConfirm·confirmDisabledReason 반영
export interface EstimateDetail {
  id: number;
  price: number;
  comment: string;
  status: EstimateStatus;
  isDesignated: boolean;
  isConfirmed: boolean;
  canConfirm: boolean;
  confirmDisabledReason: string | null;
  createdAt: string;
  updatedAt: string;
  confirmedAt: string | null;
  estimateRequest: EstimateDetailRequest;
  mover: EstimateDetailMover;
}
