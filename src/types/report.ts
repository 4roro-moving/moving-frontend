import type { Pagination } from "@/types/pagination";

export type ReportTargetType = "CUSTOMER" | "MOVER" | "REVIEW" | "RESIDENCE_REVIEW" | "GIVEAWAY";

export type ReportReason = "SPAM" | "ABUSE" | "FALSE_INFO" | "FRAUD" | "INAPPROPRIATE" | "OTHER";

export type ReportStatus = "PENDING" | "RESOLVED" | "REJECTED";

export interface ReportImage {
  id: number;
  imageUrl: string;
}

export interface MyReportItem {
  id: number;
  targetType: ReportTargetType;
  targetId: string;
  reason: ReportReason;
  status: ReportStatus;
  description: string | null;
  images: ReportImage[];
  handledAt: string | null;
  createdAt: string;
}

export interface MyReportsQuery {
  page: number;
  limit: number;
}

export interface MyReportsResult {
  reports: MyReportItem[];
  pagination: Pagination;
}
