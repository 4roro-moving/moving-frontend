import type { RegionId } from "@/lib/constants/region";
import type { MoveType } from "@/types/move";

/** URL·UI 정렬 값 (카드 필드명과 맞춤) */
export type MoverSort = "reviewCount" | "rating" | "career" | "confirmedCount";

/** 카드 UI 전용 기사님 모델 */
export interface Mover {
  id: string;
  name: string;
  /** 제공 이사 유형 (소형/가정/사무실 등, 1개 이상) */
  serviceTypes: MoveType[];
  /** 서비스 가능 지역 (시·도 id) */
  serviceAreas: RegionId[];
  title: string;
  description: string;
  rating: number;
  reviewCount: number;
  careerYears: number;
  confirmedCount: number;
  favoriteCount: number;
  isFavorite: boolean;
  profileImageSrc: string;
  activityBase: MoverPublicActivityBase | null;
}

/**기사 활동 거점 좌표 */
export interface MoverPublicActivityBase {
  latitude: number;
  longitude: number;
}

/** GET /movers 목록 아이템 */
export interface MoverListItem {
  id: string;
  moverProfileId: number;
  nickname: string;
  profileImageUrl: string | null;
  shortIntro: string;
  description: string;
  career: number;
  rating: number;
  reviewCount: number;
  confirmedEstimateCount: number;
  favoriteCount: number;
  moveTypes: MoveType[];
  isFavorite: boolean;
  activityBase: MoverPublicActivityBase | null;
}

/** GET /movers/:moverId 상세 — 목록 필드 + 서비스 가능 지역 */
export interface MoverDetailServiceArea {
  id: number;
  name: string;
}

/** 별점 분포 항목 (5점 → 1점) */
export interface MoverRatingDistributionItem {
  score: number;
  count: number;
}

export interface MoverDetailItem extends MoverListItem {
  serviceAreas: MoverDetailServiceArea[];
  /** 리뷰 별점 분포 요약 (상세 API) */
  ratingDistribution: MoverRatingDistributionItem[];
}

export interface MoversPagination {
  page: number;
  limit: number;
  totalCount: number;
  totalPages: number;
  hasNext: boolean;
}

export interface MoversListResult {
  data: MoverListItem[];
  pagination: MoversPagination;
}

export interface MoversListQuery {
  keyword?: string;
  sort?: MoverSort;
  /** 시·도 region id 문자열. API에는 number로 전달 */
  serviceArea?: string;
  moveType?: MoveType;
  page?: number;
  limit?: number;
}
