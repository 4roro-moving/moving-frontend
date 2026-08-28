import fetchInstance from "@/lib/api/fetchInstance";
import { API_ROUTES } from "@/lib/constants/apiRoutes";
import { REVIEW_PAGE_LIMIT } from "@/lib/constants/reviewConstants";
import type {
  CreateReviewRequest,
  MyReviewItem,
  MyReviewListQuery,
  MyReviewListResult,
  ReviewableEstimateItem,
  ReviewResponse,
} from "@/types/review";

export async function fetchReviewableEstimates(): Promise<ReviewableEstimateItem[]> {
  return fetchInstance.get<ReviewableEstimateItem[]>(API_ROUTES.REVIEWS.REVIEWABLE);
}

export async function fetchMyReviews(query: MyReviewListQuery = {}): Promise<MyReviewListResult> {
  const page = query.page ?? 1;
  const limit = query.limit ?? REVIEW_PAGE_LIMIT;
  const search = new URLSearchParams({
    page: String(page),
    limit: String(limit),
  });

  const result = await fetchInstance.getPaginated<MyReviewItem[]>(
    `${API_ROUTES.REVIEWS.ME}?${search.toString()}`,
  );

  return {
    reviews: result.data,
    pagination: result.pagination,
  };
}

export async function createReview(input: CreateReviewRequest): Promise<ReviewResponse> {
  return fetchInstance.post<ReviewResponse, CreateReviewRequest>(API_ROUTES.REVIEWS.ROOT, input);
}
