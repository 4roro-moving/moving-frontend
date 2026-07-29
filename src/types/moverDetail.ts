import type { MoveType } from "@/types/move";
import type { Mover, MoverRatingDistributionItem } from "@/types/mover";

export type { MoverRatingDistributionItem };

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

/**
 * 기사님 상세 화면 데이터
 * 리뷰 목록은 `GET /movers/:id/reviews`로 별도 조회합니다.
 * 별점 분포는 상세 API `ratingDistribution`을 사용합니다.
 */
export interface MoverDetail extends Mover {
  /** 제공 서비스 (칩 복수) */
  serviceTypes: MoveType[];
  ratingDistribution: MoverRatingDistributionItem[];
}
