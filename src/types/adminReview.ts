import type { Pagination } from "@/types/pagination";

export type AdminReviewSort = "LATEST" | "OLDEST" | "RATING_HIGH" | "RATING_LOW";

export interface AdminReviewListQuery {
  page?: number;
  limit?: number;
  keyword?: string;
  sort?: AdminReviewSort;
  isHidden?: boolean;
  reportedOnly?: boolean;
}

export interface AdminReviewAuthor {
  id: string;
  name: string;
  email: string;
}

export interface AdminReviewMover {
  id: string;
  name: string;
}

export interface AdminReviewLatestModeration {
  action: "HIDE" | "UNHIDE";
  reason: string | null;
  adminName: string;
  createdAt: string;
}

export interface AdminReviewItem {
  id: number;
  contentType: "REVIEW";
  isHidden: boolean;
  rating: number;
  content: string;
  author: AdminReviewAuthor;
  mover: AdminReviewMover;
  estimateId: number;
  reportCount: number;
  latestModeration: AdminReviewLatestModeration | null;
  createdAt: string;
  updatedAt: string;
}

export interface AdminReviewListResult {
  items: AdminReviewItem[];
  pagination: Pagination;
}

export interface AdminReviewActionReasonPayload {
  reason: string;
}
