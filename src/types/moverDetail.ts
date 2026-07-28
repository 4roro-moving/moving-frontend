import type { MoveType } from "@/types/move";
import type { Mover } from "@/types/mover";

/**
 * 기사님 상세 화면의 리뷰 목록 아이템 (UI)
 */
export interface MoverDetailReview {
  id: string;
  authorMasked: string;
  createdAt: string;
  rating: number;
  content: string;
}

/** 별점 분포 (5점 → 1점) */
export interface MoverRatingDistributionItem {
  score: number;
  count: number;
}

/**
 * 기사님 상세 화면 데이터
 * 리뷰 목록은 `GET /movers/:id/reviews`로 별도 조회합니다.
 */
export interface MoverDetail extends Mover {
  /** 제공 서비스 (칩 복수) */
  serviceTypes: MoveType[];
  /** API 미제공 — 분포 데이터가 있을 때만 UI에 표시 */
  ratingDistribution: MoverRatingDistributionItem[];
}
