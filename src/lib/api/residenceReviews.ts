import fetchInstance from "@/lib/api/fetchInstance";
import { API_ROUTES } from "@/lib/constants/apiRoutes";
import type { CursorPagination, Pagination } from "@/types/pagination";
import type {
  PublicResidenceReview,
  ResidenceReviewListQuery,
  ResidenceReviewListResult,
  ResidenceReviewMyListQuery,
  ResidenceReviewMyListResult,
  UpdateResidenceReviewInput,
} from "@/types/residenceReview";

export const fetchResidenceReviews = async (
  query: ResidenceReviewListQuery,
): Promise<ResidenceReviewListResult> => {
  const params = new URLSearchParams();
  params.set("limit", String(query.limit));
  params.set("sort", query.sort);

  if (query.keyword) {
    params.set("keyword", query.keyword);
  }
  if (query.regionId !== undefined) {
    params.set("regionId", String(query.regionId));
  }
  if (query.rating !== undefined) {
    params.set("rating", String(query.rating));
  }
  if (query.cursor) {
    params.set("cursor", query.cursor);
  }

  return fetchInstance.getPaginated<PublicResidenceReview[], CursorPagination>(
    `${API_ROUTES.RESIDENCE_REVIEWS.ROOT}?${params.toString()}`,
  );
};

export const fetchResidenceReviewDetail = (residenceReviewId: number) =>
  fetchInstance.get<PublicResidenceReview>(API_ROUTES.RESIDENCE_REVIEWS.DETAIL(residenceReviewId));

export const fetchMyResidenceReviews = async (
  query: ResidenceReviewMyListQuery,
): Promise<ResidenceReviewMyListResult> => {
  const params = new URLSearchParams({
    page: String(query.page),
    limit: String(query.limit),
  });

  const result = await fetchInstance.getPaginated<PublicResidenceReview[], Pagination>(
    `${API_ROUTES.RESIDENCE_REVIEWS.ME}?${params.toString()}`,
  );

  return {
    reviews: result.data,
    pagination: result.pagination,
  };
};

export const updateResidenceReview = (
  residenceReviewId: number,
  body: UpdateResidenceReviewInput,
) =>
  fetchInstance.patch<PublicResidenceReview, UpdateResidenceReviewInput>(
    API_ROUTES.RESIDENCE_REVIEWS.DETAIL(residenceReviewId),
    body,
  );

export const deleteResidenceReview = (residenceReviewId: number) =>
  fetchInstance.delete<{ id: number }>(API_ROUTES.RESIDENCE_REVIEWS.DETAIL(residenceReviewId));
