import type { MoveType } from "@/types/move";
import type { Pagination } from "@/types/pagination";

/**
 * 백엔드 `GET /reviews/reviewable` 응답 아이템
 * // 2026.07.27 정슬기 - [추가] 작성 가능 리뷰 API 타입
 */
export interface ReviewableEstimateItem {
  estimateId: number;
  price: number;
  confirmedAt: string | null;
  estimateRequest: {
    id: number;
    moveType: MoveType;
    moveDate: string;
    fromAddress: string;
    toAddress: string;
    status: string;
  };
  mover: {
    id: string;
    nickname: string | null;
    imageUrl: string | null;
    career: number | null;
    averageRating: number | null;
    reviewCount: number | null;
  };
}

/**
 * 백엔드 `GET /reviews/me` 응답 아이템
 * // 2026.07.27 정슬기 - [추가] 내가 작성한 리뷰 API 타입
 */
export interface MyReviewItem {
  id: number;
  estimateId: number;
  rating: number;
  content: string;
  createdAt: string;
  price: number;
  estimateRequest: {
    id: number;
    moveType: MoveType;
    moveDate: string;
    fromAddress: string;
    toAddress: string;
  };
  mover: {
    id: string;
    name: string;
    nickname: string | null;
    imageUrl: string | null;
    shortIntro: string | null;
  };
}

export interface MyReviewListResult {
  reviews: MyReviewItem[];
  pagination: Pagination;
}

export interface MyReviewListQuery {
  page?: number;
  limit?: number;
}

/**
 * 백엔드 `GET /movers/:moverId/reviews` 응답 아이템
 */
export interface MoverReviewItem {
  id: number;
  rating: number;
  content: string;
  createdAt: string;
  customer: {
    id: string;
    displayName: string;
    imageUrl: string | null;
  };
  estimateRequest: {
    id: number;
    moveType: MoveType;
    moveDate: string;
  };
}

export interface MoverReviewListResult {
  reviews: MoverReviewItem[];
  pagination: Pagination;
}

export interface MoverReviewListQuery {
  page?: number;
  limit?: number;
}

/** `POST /reviews` 요청 body */
export interface CreateReviewRequest {
  estimateId: number;
  rating: number;
  content: string;
}

/** @deprecated CreateReviewRequest 사용 */
export type CreateReviewInput = CreateReviewRequest;

/** `POST /reviews` 생성 응답 (data) */
export interface ReviewResponse {
  id: number;
  estimateId: number;
  rating: number;
  content: string;
  createdAt: string;
}

/** @deprecated ReviewResponse 사용 */
export type CreatedReview = ReviewResponse;
