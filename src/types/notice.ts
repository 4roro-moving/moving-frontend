import type { Pagination } from "@/types/pagination";

export type NoticeAudience = "ALL" | "CUSTOMER" | "MOVER";

export interface NoticeItem {
  id: number;
  title: string;
  content: string;
  audience: NoticeAudience;
  isPinned: boolean;
  viewCount: number;
  createdAt: string;
  updatedAt: string;
}

export interface NoticeListQuery {
  page: number;
  limit: number;
  keyword?: string;
}

export interface NoticeListResult {
  notices: NoticeItem[];
  pagination: Pagination;
}
