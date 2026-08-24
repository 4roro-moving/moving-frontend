import fetchInstance from "@/lib/api/fetchInstance";
import { hasSuspensionAppealSession } from "@/lib/auth/suspensionAppealSession";
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

const getInquiryAuthOptions = () => {
  if (!hasSuspensionAppealSession()) {
    return undefined;
  }

  return {
    // 제한 세션은 /api/inquiries 경로의 HttpOnly Cookie로 자동 전송된다.
    // 남아 있는 일반 Access Token이 제한 세션보다 우선 적용되지 않게 한다.
    skipAuth: true,
    skipRefresh: true,
  } as const;
};

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
    getInquiryAuthOptions(),
  );

  return {
    inquiries: result.data,
    pagination: result.pagination,
  };
};

export const fetchInquiryDetail = (inquiryId: number) =>
  fetchInstance.get<InquiryDetail>(API_ROUTES.INQUIRIES.DETAIL(inquiryId), getInquiryAuthOptions());

export const createInquiry = (body: CreateInquiryInput) =>
  fetchInstance.post<InquiryDetail, CreateInquiryInput>(
    API_ROUTES.INQUIRIES.ROOT,
    body,
    getInquiryAuthOptions(),
  );

export const addInquiryMessage = (inquiryId: number, body: CreateInquiryMessageInput) =>
  fetchInstance.post<InquiryDetail, CreateInquiryMessageInput>(
    API_ROUTES.INQUIRIES.MESSAGES(inquiryId),
    body,
    getInquiryAuthOptions(),
  );

export const closeInquiry = (inquiryId: number) =>
  fetchInstance.patch<InquiryDetail>(
    API_ROUTES.INQUIRIES.CLOSE(inquiryId),
    undefined,
    getInquiryAuthOptions(),
  );
