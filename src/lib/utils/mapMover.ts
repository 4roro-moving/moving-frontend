import { REGION_LABEL, type RegionId } from "@/lib/constants/region";
import { resolveMoverProfileImageSrc } from "@/lib/utils/moverProfileImage";
import type { Mover, MoverDetailItem, MoverListItem } from "@/types/mover";
import type { MoverDetail } from "@/types/moverDetail";
import type { MoveType } from "@/types/move";

const EMPTY_RATING_DISTRIBUTION = [
  { score: 5, count: 0 },
  { score: 4, count: 0 },
  { score: 3, count: 0 },
  { score: 2, count: 0 },
  { score: 1, count: 0 },
] as const;

function isRegionId(value: number): value is RegionId {
  return value in REGION_LABEL;
}

function mapServiceTypes(moveTypes: MoveType[]): MoveType[] {
  return moveTypes.length > 0 ? moveTypes : (["SMALL"] as MoveType[]);
}

/** API 목록 아이템을 카드용 데이터로 변환 */
export function mapMoverListItemToMover(item: MoverListItem): Mover {
  return {
    id: item.id,
    name: item.nickname,
    serviceTypes: mapServiceTypes(item.moveTypes),
    // 목록 API는 serviceAreas를 주지 않음 (상세 API에만 존재)
    serviceAreas: [],
    title: item.shortIntro,
    description: item.description,
    rating: item.rating,
    reviewCount: item.reviewCount,
    careerYears: item.career,
    confirmedCount: item.confirmedEstimateCount,
    favoriteCount: item.favoriteCount,
    isFavorite: item.isFavorite,
    profileImageSrc: resolveMoverProfileImageSrc(item.profileImageUrl),
  };
}

/** API 상세 응답을 상세 화면용 데이터로 변환 (리뷰 목록/분포는 후속 연동) */
export function mapMoverDetailItemToMoverDetail(item: MoverDetailItem): MoverDetail {
  const base = mapMoverListItemToMover(item);

  return {
    ...base,
    serviceAreas: item.serviceAreas.map((area) => area.id).filter(isRegionId),
    ratingDistribution: [...EMPTY_RATING_DISTRIBUTION],
    reviews: [],
    reviewPageCount: 0,
  };
}
