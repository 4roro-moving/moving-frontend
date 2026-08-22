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

export const GIVEAWAY_IMAGE_CONTENT_TYPES = ["image/jpeg", "image/png", "image/webp"] as const;

export type GiveawayImageContentType = (typeof GIVEAWAY_IMAGE_CONTENT_TYPES)[number];

export const isGiveawayImageContentType = (value: string): value is GiveawayImageContentType => {
  return (GIVEAWAY_IMAGE_CONTENT_TYPES as readonly string[]).includes(value);
};

export interface GiveawayImageUploadUrlRequest {
  contentType: GiveawayImageContentType;
  size: number;
}

export interface GiveawayImageUploadUrlResult {
  uploadUrl: string;
  key: string;
  expiresIn: number;
}

export interface CreateGiveawayInput {
  title: string;
  description: string;
  regionId?: number;
  imageKeys: string[];
}

export interface GiveawayImage {
  id: number;
  imageUrl: string;
  sortOrder: number;
}

export interface GiveawayMyRequest {
  id: number;
  status: string;
  message: string | null;
  createdAt: string;
  updatedAt: string;
}

export const GIVEAWAY_REQUEST_STATUS = {
  PENDING: "PENDING",
  SELECTED: "SELECTED",
  REJECTED: "REJECTED",
  CANCELLED: "CANCELLED",
} as const;

export type GiveawayRequestStatus =
  (typeof GIVEAWAY_REQUEST_STATUS)[keyof typeof GIVEAWAY_REQUEST_STATUS];

export interface GiveawayRequestGiveawaySummary {
  id: number;
  title: string;
  status: GiveawayStatus;
  author: GiveawayAuthor;
  region: GiveawayRegion | null;
  thumbnailUrl: string | null;
}

export interface MyGiveawayRequestItem {
  id: number;
  status: GiveawayRequestStatus;
  message: string | null;
  createdAt: string;
  updatedAt: string;
  giveaway: GiveawayRequestGiveawaySummary;
}

export interface GiveawayRequestMyListQuery {
  keyword?: string;
  status?: GiveawayRequestStatus;
  sort: GiveawayListSort;
  cursor?: string;
  limit: number;
}

export interface GiveawayRequestMyListResult {
  data: MyGiveawayRequestItem[];
  pagination: CursorPagination;
}

export interface UpdateGiveawayRequestInput {
  message: string | null;
}

export interface GiveawayRequestItem {
  id: number;
  giveawayId: number;
  status: GiveawayRequestStatus;
  message: string | null;
  createdAt: string;
  updatedAt: string;
  requester: GiveawayAuthor;
}

export interface GiveawayDetail {
  id: number;
  title: string;
  description: string;
  status: GiveawayStatus;
  createdAt: string;
  updatedAt: string;
  author: GiveawayAuthor;
  region: GiveawayRegion | null;
  images: GiveawayImage[];
  activeRequestCount: number;
  receiver: GiveawayAuthor | null;
  canRequest: boolean;
  myRequest: GiveawayMyRequest | null;
}
