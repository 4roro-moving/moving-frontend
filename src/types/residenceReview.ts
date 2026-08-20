import type { CursorPagination, Pagination } from "@/types/pagination";

export const RESIDENCE_REVIEW_LIST_SORT = {
  CREATED_AT: "createdAt",
  CREATED_AT_ASC: "createdAtAsc",
} as const;

export type ResidenceReviewListSort =
  (typeof RESIDENCE_REVIEW_LIST_SORT)[keyof typeof RESIDENCE_REVIEW_LIST_SORT];

export const RESIDENCE_REVIEW_RATING = {
  MIN: 1,
  MAX: 5,
} as const;

export type ResidenceReviewRating =
  typeof RESIDENCE_REVIEW_RATING.MIN | 2 | 3 | 4 | typeof RESIDENCE_REVIEW_RATING.MAX;

export interface ResidenceReviewAuthor {
  id: string;
  name: string;
  imageUrl: string | null;
}

export interface ResidenceReviewRegion {
  id: number;
  name: string;
  averageRating?: number | null;
}

export interface PublicResidenceReview {
  id: number;
  title: string;
  content: string;
  rating: number;
  region: ResidenceReviewRegion;
  author: ResidenceReviewAuthor;
  isMine: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface ResidenceReviewListQuery {
  keyword?: string;
  regionId?: number;
  rating?: ResidenceReviewRating;
  sort: ResidenceReviewListSort;
  cursor?: string;
  limit: number;
}

export interface ResidenceReviewListResult {
  data: PublicResidenceReview[];
  pagination: CursorPagination;
}

export interface ResidenceReviewMyListQuery {
  page: number;
  limit: number;
}

export interface ResidenceReviewMyListResult {
  reviews: PublicResidenceReview[];
  pagination: Pagination;
}

export interface CreateResidenceReviewInput {
  regionId: number;
  title: string;
  content: string;
  rating: number;
}

export interface UpdateResidenceReviewInput {
  title?: string;
  content?: string;
  rating?: number;
}
