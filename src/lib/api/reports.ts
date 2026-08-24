import fetchInstance from "@/lib/api/fetchInstance";
import { API_ROUTES } from "@/lib/constants/apiRoutes";
import type {
  CreateReportImageUploadUrlInput,
  CreateReportInput,
  MyReportItem,
  MyReportsQuery,
  MyReportsResult,
  ReportImageUploadUrlResponse,
} from "@/types/report";
import type { Pagination } from "@/types/pagination";

export const fetchMyReports = async (query: MyReportsQuery): Promise<MyReportsResult> => {
  const params = new URLSearchParams({
    page: String(query.page),
    limit: String(query.limit),
  });

  const result = await fetchInstance.getPaginated<MyReportItem[], Pagination>(
    `${API_ROUTES.REPORTS.ME}?${params.toString()}`,
  );

  return {
    reports: result.data,
    pagination: result.pagination,
  };
};

export const createReport = (body: CreateReportInput) =>
  fetchInstance.post(API_ROUTES.REPORTS.ROOT, body);

export const requestReportImageUploadUrl = (body: CreateReportImageUploadUrlInput) =>
  fetchInstance.post<ReportImageUploadUrlResponse, CreateReportImageUploadUrlInput>(
    API_ROUTES.REPORTS.IMAGE_UPLOAD_URL,
    body,
  );

export const uploadReportImageToPresignedUrl = async (
  uploadUrl: string,
  file: File,
): Promise<void> => {
  const response = await fetch(uploadUrl, {
    method: "PUT",
    headers: {
      "Content-Type": file.type,
    },
    body: file,
  });

  if (!response.ok) {
    throw new Error("신고 이미지 업로드에 실패했습니다.");
  }
};
