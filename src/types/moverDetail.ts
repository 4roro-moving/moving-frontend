import type { MoveType } from "@/types/move";
import type { Mover } from "@/types/mover";

/** 기사님 상세 목업용 리뷰 아이템 */
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
 * 목록용 `Mover`에 상세·리뷰 UI용 필드를 확장합니다.
 * (리뷰 목록/분포는 후속 API 연동 전까지 비울 수 있음)
 */
export interface MoverDetail extends Mover {
  /** 제공 서비스 (칩 복수) */
  serviceTypes: MoveType[];
  ratingDistribution: MoverRatingDistributionItem[];
  reviews: MoverDetailReview[];
  reviewPageCount: number;
}
