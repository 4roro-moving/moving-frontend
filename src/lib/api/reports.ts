import fetchInstance from "@/lib/api/fetchInstance";
import { API_ROUTES } from "@/lib/constants/apiRoutes";
import type { MyReportItem, MyReportsQuery, MyReportsResult } from "@/types/report";
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
