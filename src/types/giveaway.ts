import type { CursorPagination } from "@/types/pagination";

export const GIVEAWAY_STATUS = {
  AVAILABLE: "AVAILABLE",
  IN_PROGRESS: "IN_PROGRESS",
  COMPLETED: "COMPLETED",
} as const;

export type GiveawayStatus = (typeof GIVEAWAY_STATUS)[keyof typeof GIVEAWAY_STATUS];

export const GIVEAWAY_LIST_SORT = {
  LATEST: "LATEST",
  OLDEST: "OLDEST",
} as const;

export type GiveawayListSort = (typeof GIVEAWAY_LIST_SORT)[keyof typeof GIVEAWAY_LIST_SORT];

export interface GiveawayAuthor {
  id: string;
  name: string;
}

export interface GiveawayRegion {
  id: number;
  name: string;
}

export interface GiveawayListItem {
  id: number;
  title: string;
  status: GiveawayStatus;
  createdAt: string;
  updatedAt: string;
  author: GiveawayAuthor;
  region: GiveawayRegion | null;
  thumbnailUrl: string | null;
  activeRequestCount: number;
}

export interface GiveawayListQuery {
  keyword?: string;
  regionId?: number;
  status?: GiveawayStatus;
  sort: GiveawayListSort;
  cursor?: string;
  limit: number;
}

export interface GiveawayMyListQuery {
  status?: GiveawayStatus;
  sort: GiveawayListSort;
  cursor?: string;
  limit: number;
}

export interface GiveawayListResult {
  data: GiveawayListItem[];
  pagination: CursorPagination;
}
