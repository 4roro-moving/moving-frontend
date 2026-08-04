import fetchInstance from "@/lib/api/fetchInstance";
import { API_ROUTES } from "@/lib/constants/apiRoutes";
import type {
  AdminReviewActionReasonPayload,
  AdminReviewItem,
  AdminReviewListQuery,
  AdminReviewListResult,
} from "@/types/adminReview";

export const ADMIN_REVIEW_LIST_PAGE_LIMIT = 10;

const SORT_FALLBACK = "LATEST";

export async function fetchAdminReviews(
  query: AdminReviewListQuery = {},
): Promise<AdminReviewListResult> {
  const page = query.page ?? 1;
  const limit = query.limit ?? ADMIN_REVIEW_LIST_PAGE_LIMIT;
  const sort = query.sort ?? SORT_FALLBACK;
  const search = new URLSearchParams({
    page: String(page),
    limit: String(limit),
    sort,
  });

  if (query.keyword) {
    search.set("keyword", query.keyword);
  }
  if (query.isHidden !== undefined) {
    search.set("isHidden", String(query.isHidden));
  }
  if (query.reportedOnly !== undefined) {
    search.set("reportedOnly", String(query.reportedOnly));
  }

  const result = await fetchInstance.getPaginated<AdminReviewItem[]>(
    `${API_ROUTES.ADMIN.REVIEWS.ROOT}?${search.toString()}`,
  );

  return {
    items: result.data,
    pagination: result.pagination,
  };
}

export async function hideAdminReview(
  reviewId: number,
  payload: AdminReviewActionReasonPayload,
): Promise<AdminReviewItem> {
  return fetchInstance.post<AdminReviewItem, AdminReviewActionReasonPayload>(
    API_ROUTES.ADMIN.REVIEWS.HIDE(reviewId),
    payload,
  );
}

export async function unhideAdminReview(
  reviewId: number,
  payload?: AdminReviewActionReasonPayload,
): Promise<AdminReviewItem> {
  return fetchInstance.post<AdminReviewItem, AdminReviewActionReasonPayload | undefined>(
    API_ROUTES.ADMIN.REVIEWS.UNHIDE(reviewId),
    payload,
  );
}
