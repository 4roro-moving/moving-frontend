import fetchInstance from "@/lib/api/fetchInstance";
import {
  hasSuspensionAppealSession,
  invalidateSuspensionAppealSession,
} from "@/lib/auth/suspensionAppealSession";
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
import { ApiError } from "@/types/api";

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

// 제한 세션 상태의 문의 요청이 401/403이면 제한 세션 표시 무효화
const requestInquiry = async <T>(request: () => Promise<T>): Promise<T> => {
  try {
    return await request();
  } catch (error) {
    if (
      hasSuspensionAppealSession() &&
      error instanceof ApiError &&
      (error.status === 401 || error.status === 403)
    ) {
      invalidateSuspensionAppealSession();
    }

    throw error;
  }
};

export const fetchInquiries = async (query: InquiryListQuery): Promise<InquiryListResult> => {
  const params = new URLSearchParams({
    page: String(query.page),
    limit: String(query.limit),
  });

  if (query.status) {
    params.set("status", query.status);
  }

  const result = await requestInquiry(() =>
    fetchInstance.getPaginated<InquiryListItem[], Pagination>(
      `${API_ROUTES.INQUIRIES.ROOT}?${params.toString()}`,
      getInquiryAuthOptions(),
    ),
  );

  return {
    inquiries: result.data,
    pagination: result.pagination,
  };
};

export const fetchInquiryDetail = (inquiryId: number) =>
  requestInquiry(() =>
    fetchInstance.get<InquiryDetail>(
      API_ROUTES.INQUIRIES.DETAIL(inquiryId),
      getInquiryAuthOptions(),
    ),
  );

export const createInquiry = (body: CreateInquiryInput) =>
  requestInquiry(() =>
    fetchInstance.post<InquiryDetail, CreateInquiryInput>(
      API_ROUTES.INQUIRIES.ROOT,
      body,
      getInquiryAuthOptions(),
    ),
  );

export const addInquiryMessage = (inquiryId: number, body: CreateInquiryMessageInput) =>
  requestInquiry(() =>
    fetchInstance.post<InquiryDetail, CreateInquiryMessageInput>(
      API_ROUTES.INQUIRIES.MESSAGES(inquiryId),
      body,
      getInquiryAuthOptions(),
    ),
  );

export const closeInquiry = (inquiryId: number) =>
  requestInquiry(() =>
    fetchInstance.patch<InquiryDetail>(
      API_ROUTES.INQUIRIES.CLOSE(inquiryId),
      undefined,
      getInquiryAuthOptions(),
    ),
  );
