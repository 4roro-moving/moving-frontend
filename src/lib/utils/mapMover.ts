import { resolveMoverProfileImageSrc } from "@/lib/utils/moverProfileImage";
import type { Mover, MoverListItem } from "@/types/mover";
import type { MoveType } from "@/types/move";

/** API 목록 아이템을 카드용 데이터로 변환 */
export function mapMoverListItemToMover(item: MoverListItem): Mover {
  const serviceTypes = item.moveTypes.length > 0 ? item.moveTypes : (["SMALL"] as MoveType[]);

  return {
    id: item.id,
    name: item.nickname,
    serviceTypes,
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
