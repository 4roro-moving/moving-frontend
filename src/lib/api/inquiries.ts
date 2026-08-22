import fetchInstance from "@/lib/api/fetchInstance";
import { API_ROUTES } from "@/lib/constants/apiRoutes";
import type {
  CreateInquiryInput,
  CreateInquiryMessageInput,
  InquiryDetail,
  InquiryListItem,
  InquiryListQuery,
  InquiryListResult,
} from "@/types/inquiry";
import type { Pagination } from "@/types/pagination";

export const fetchInquiries = async (query: InquiryListQuery): Promise<InquiryListResult> => {
  const params = new URLSearchParams({
    page: String(query.page),
    limit: String(query.limit),
  });

  if (query.status) {
    params.set("status", query.status);
  }

  const result = await fetchInstance.getPaginated<InquiryListItem[], Pagination>(
    `${API_ROUTES.INQUIRIES.ROOT}?${params.toString()}`,
  );

  return {
    inquiries: result.data,
    pagination: result.pagination,
  };
};

export const fetchInquiryDetail = (inquiryId: number) =>
  fetchInstance.get<InquiryDetail>(API_ROUTES.INQUIRIES.DETAIL(inquiryId));

export const createInquiry = (body: CreateInquiryInput) =>
  fetchInstance.post<InquiryDetail, CreateInquiryInput>(API_ROUTES.INQUIRIES.ROOT, body);

export const addInquiryMessage = (inquiryId: number, body: CreateInquiryMessageInput) =>
  fetchInstance.post<InquiryDetail, CreateInquiryMessageInput>(
    API_ROUTES.INQUIRIES.MESSAGES(inquiryId),
    body,
  );

export const closeInquiry = (inquiryId: number) =>
  fetchInstance.patch<InquiryDetail>(API_ROUTES.INQUIRIES.CLOSE(inquiryId));
