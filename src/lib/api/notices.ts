import fetchInstance from "@/lib/api/fetchInstance";
import { API_ROUTES } from "@/lib/constants/apiRoutes";
import type { Pagination } from "@/types/pagination";
import type { NoticeItem, NoticeListQuery, NoticeListResult } from "@/types/notice";

export const fetchNotices = async (query: NoticeListQuery): Promise<NoticeListResult> => {
  const params = new URLSearchParams({
    page: String(query.page),
    limit: String(query.limit),
  });

  if (query.keyword) {
    params.set("keyword", query.keyword);
  }

  const result = await fetchInstance.getPaginated<NoticeItem[], Pagination>(
    `${API_ROUTES.NOTICES.ROOT}?${params.toString()}`,
  );

  return {
    notices: result.data,
    pagination: result.pagination,
  };
};

export const fetchNoticeDetail = (noticeId: number) =>
  fetchInstance.get<NoticeItem>(API_ROUTES.NOTICES.DETAIL(noticeId));
