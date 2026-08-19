import { REGION_LABEL, type RegionId } from "@/lib/constants/region";
import { resolveMoverProfileImageSrc } from "@/lib/utils/moverProfileImage";
import type {
  Mover,
  MoverDetailItem,
  MoverListItem,
  MoverRatingDistributionItem,
} from "@/types/mover";
import type { MoverDetail } from "@/types/moverDetail";
import type { MoveType } from "@/types/move";

const RATING_SCORES = [5, 4, 3, 2, 1] as const;

function isRegionId(value: number): value is RegionId {
  return value in REGION_LABEL;
}

function mapServiceTypes(moveTypes: MoveType[]): MoveType[] {
  return moveTypes.length > 0 ? moveTypes : (["SMALL"] as MoveType[]);
}

/** API 분포를 5→1점 순으로 맞추고, 없는 점수는 0으로 채웁니다. */
function mapRatingDistribution(
  items: MoverRatingDistributionItem[] | undefined,
): MoverRatingDistributionItem[] {
  const countByScore = new Map((items ?? []).map((item) => [item.score, item.count]));

  return RATING_SCORES.map((score) => ({
    score,
    count: countByScore.get(score) ?? 0,
  }));
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
    activityBase: item.activityBase, //기사 활동 거점
  };
}

/** API 상세 응답을 상세 화면용 데이터로 변환 */
export function mapMoverDetailItemToMoverDetail(item: MoverDetailItem): MoverDetail {
  const base = mapMoverListItemToMover(item);

  return {
    ...base,
    serviceAreas: item.serviceAreas.map((area) => area.id).filter(isRegionId),
    ratingDistribution: mapRatingDistribution(item.ratingDistribution),
  };
}
