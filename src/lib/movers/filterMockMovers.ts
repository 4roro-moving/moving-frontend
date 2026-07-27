import { MOVERS_ALL_VALUE, type MoversSearchParamsState } from "@/lib/movers/searchParams";
import type { RegionId } from "@/lib/constants/region";
import type { MoveType } from "@/types/move";
import type { Mover } from "@/types/mover";

/** NOTE: API 연동 전 mock 목록을 URL 기준으로 필터링 (임시) */
export function filterMockMovers(movers: Mover[], filters: MoversSearchParamsState): Mover[] {
  let filtered = movers;

  if (filters.keyword.trim()) {
    const query = filters.keyword.trim().toLowerCase();
    filtered = filtered.filter(
      (mover) =>
        mover.name.toLowerCase().includes(query) ||
        mover.title.toLowerCase().includes(query) ||
        mover.description.toLowerCase().includes(query),
    );
  }

  if (filters.serviceArea !== MOVERS_ALL_VALUE) {
    const regionId = Number(filters.serviceArea) as RegionId;
    filtered = filtered.filter((mover) => mover.serviceAreas.includes(regionId));
  }

  if (filters.moveType !== MOVERS_ALL_VALUE) {
    filtered = filtered.filter((mover) => mover.serviceType === (filters.moveType as MoveType));
  }

  return [...filtered].sort((a, b) => {
    switch (filters.sort) {
      case "rating":
        return b.rating - a.rating;
      case "career":
        return b.careerYears - a.careerYears;
      case "confirmedCount":
        return b.confirmedCount - a.confirmedCount;
      case "reviewCount":
      default:
        return b.reviewCount - a.reviewCount;
    }
  });
}
