import type { RegionId } from "@/lib/constants/region";
import type { MoveType } from "@/types/move";

export type MoverSort = "reviewCount" | "rating" | "career" | "confirmedCount";

export interface Mover {
  id: string;
  name: string;
  serviceType: MoveType;
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
}
