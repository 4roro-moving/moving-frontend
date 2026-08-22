import type { Pagination } from "@/types/pagination";

export type ReportTargetType = "CUSTOMER" | "MOVER" | "REVIEW" | "RESIDENCE_REVIEW" | "GIVEAWAY";

export type ReportReason = "SPAM" | "ABUSE" | "FALSE_INFO" | "INAPPROPRIATE" | "PRIVACY" | "OTHER";

export type ReportStatus = "PENDING" | "RESOLVED" | "REJECTED";

export const REPORT_IMAGE_CONTENT_TYPES = ["image/jpeg", "image/png", "image/webp"] as const;

export type ReportImageContentType = (typeof REPORT_IMAGE_CONTENT_TYPES)[number];

export const REPORT_IMAGE_MAX_COUNT = 5;
export const REPORT_IMAGE_MAX_SIZE = 5 * 1024 * 1024;
export const REPORT_DESCRIPTION_MAX_LENGTH = 1000;

export interface ReportImageItem {
  id: number;
  imageUrl: string;
}

export interface CreateReportInput {
  targetType: ReportTargetType;
  targetId: string;
  reason: ReportReason;
  description?: string;
  imageKeys?: string[];
}

export interface CreateReportImageUploadUrlInput {
  contentType: ReportImageContentType;
}

export interface ReportImageUploadUrlResponse {
  uploadUrl: string;
  key: string;
  expiresIn: number;
}

export interface MyReportsQuery {
  page: number;
  limit: number;
}

export interface MyReportItem {
  id: number;
  targetType: ReportTargetType;
  targetId: string;
  reason: ReportReason;
  status: ReportStatus;
  description: string | null;
  images: ReportImageItem[];
  handledAt: string | null;
  createdAt: string;
}

export interface MyReportsResult {
  reports: MyReportItem[];
  pagination: Pagination;
}
