import type { Pagination } from "@/types/pagination";

export type InquiryCategory = "SUSPENSION_APPEAL" | "ACCOUNT" | "SERVICE" | "ETC";
export type InquiryStatus = "OPEN" | "ANSWERED" | "CLOSED";

export interface InquiryListItem {
  id: number;
  category: InquiryCategory;
  title: string;
  status: InquiryStatus;
  handledBy: string | null;
  closedAt: string | null;
  lastMessageAt: string;
  createdAt: string;
  updatedAt: string;
}

export interface InquiryUserSummary {
  id: string;
  name: string;
}

export interface InquiryMessage {
  id: number;
  senderId: string;
  content: string;
  isAdmin: boolean;
  isRead: boolean;
  createdAt: string;
  sender: InquiryUserSummary;
}

export interface InquiryDetail extends InquiryListItem {
  authorId: string;
  author: InquiryUserSummary;
  handler: InquiryUserSummary | null;
  messages: InquiryMessage[];
}

export interface InquiryListQuery {
  page: number;
  limit: number;
  status?: InquiryStatus;
}

export interface InquiryListResult {
  inquiries: InquiryListItem[];
  pagination: Pagination;
}

export interface CreateInquiryInput {
  category: InquiryCategory;
  title: string;
  content: string;
}

export interface CreateInquiryMessageInput {
  content: string;
}
