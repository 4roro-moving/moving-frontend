import type { Pagination } from "@/types/pagination";

import type { MoveType } from "@/types/move";

// 2026.07.24 정슬기 - [수정] Mock pending/confirmed 대신 백엔드 EstimateStatus 응답 구조 적용
export type EstimateStatus = "SENT" | "CONFIRMED" | "EXPIRED" | "CANCELED";

export type EstimateRequestStatus =
  "PENDING" | "OPEN" | "CONFIRMED" | "COMPLETED" | "EXPIRED" | "CANCELED";

/** 받았던 견적 목록 드롭다운 필터 (Figma: 전체 / 확정견적) */
// 2026.07.29 정슬기 - [수정] pending 옵션 제거 — 카드 라벨의 견적대기는 유지
export type EstimateOfferFilter = "all" | "confirmed";

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

/**
 * GET /api/estimate-requests 목록 아이템
 * 백엔드 `EstimateRequestDetail` JSON 직렬화 형태와 동일합니다.
 * // 2026.07.25 정슬기 - [추가] 내 견적 관리(대기 중 견적 요청) 타입
 */
export interface MyEstimateRequestDesignatedMover {
  moverId: string;
  createdAt: string;
  mover: {
    id: string;
    name: string;
    moverProfile: {
      nickname: string | null;
      imageUrl: string | null;
    } | null;
  };
}

/**
 * 대기 중 견적 목록 UI용 견적서 카드 View 데이터
 * 받은 견적 목록 아이템과 동일 형태를 재사용합니다.
 * // 2026.07.25 정슬기 - [추가] Figma 대기 목록 견적서 카드용 타입
 */
export type MyPendingEstimateOffer = ReceivedEstimateListItem;

export interface MyEstimateRequestItem {
  id: number;
  customerId: string;
  moveType: MoveType;
  moveDate: string;
  fromZipCode: string;
  fromAddress: string;
  fromDetailAddress: string | null;
  toZipCode: string;
  toAddress: string;
  toDetailAddress: string | null;
  status: EstimateRequestStatus;
  isActive: boolean;
  expiresAt: string;
  createdAt: string;
  canceledAt: string | null;
  fromRegion: { id: number; name: string };
  toRegion: { id: number; name: string };
  designatedMovers: MyEstimateRequestDesignatedMover[];
  _count: { estimates: number };
}

/**
 * 보낸 견적 요청 목록 UI 상태 필터
 * all → status 미전달 / OPEN → 진행 중 / COMPLETED → 이사 완료
 * // 2026.07.29 정슬기 - [추가]
 */
export type EstimateRequestListStatusFilter = "all" | "OPEN" | "COMPLETED";

export interface MyEstimateRequestListQuery {
  page?: number;
  limit?: number;
  /** 미전달 시 전체. BE: PENDING|OPEN|CONFIRMED|COMPLETED|EXPIRED|CANCELED */
  // 2026.07.29 정슬기 - [추가] GET /estimate-requests?status=
  status?: EstimateRequestStatus;
}

export interface MyEstimateRequestListResult {
  estimateRequests: MyEstimateRequestItem[];
  pagination: Pagination;
}

/**
 * GET /estimates/pending 섹션 응답
 * request: MyEstimateRequestItem과 동일 필드, estimates: mapListEstimate(+isFavorite)
 * // 2026.07.25 정슬기 - [추가] 요청+견적서 섹션 ViewModel
 * // 2026.07.28 정슬기 - [수정] BE pending 실 API 계약 기준으로 정리
 */
export interface PendingEstimateSection {
  request: MyEstimateRequestItem;
  estimates: MyPendingEstimateOffer[];
}

export interface PendingEstimateSectionListResult {
  sections: PendingEstimateSection[];
  pagination: Pagination;
}
