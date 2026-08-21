import type { Pagination } from "@/types/pagination";

export type NoticeAudience = "ALL" | "CUSTOMER" | "MOVER";
export type NoticeCategory = "SERVICE" | "MAINTENANCE" | "EVENT";

export const NOTICE_CATEGORY_LABEL: Record<NoticeCategory, string> = {
  SERVICE: "서비스 안내",
  MAINTENANCE: "점검 안내",
  EVENT: "이벤트 안내",
};

export interface NoticeItem {
  id: number;
  title: string;
  content: string;
  audience: NoticeAudience;
  category: NoticeCategory;
  isPinned: boolean;
  viewCount: number;
  createdAt: string;
  updatedAt: string;
}

export interface NoticeListQuery {
  page: number;
  limit: number;
  keyword?: string;
  category?: NoticeCategory;
}

export interface NoticeListResult {
  notices: NoticeItem[];
  pagination: Pagination;
}
