import type { MoveType } from "@/types/move";

export type MoverSort = "reviewCount" | "rating" | "career" | "confirmedCount";

export interface Mover {
  id: string;
  name: string;
  serviceType: MoveType;
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
