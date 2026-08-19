import fetchInstance from "@/lib/api/fetchInstance";
import { API_ROUTES } from "@/lib/constants/apiRoutes";
import type { CursorPagination } from "@/types/pagination";
import type {
  PublicResidenceReview,
  ResidenceReviewListQuery,
  ResidenceReviewListResult,
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

export const deleteResidenceReview = (residenceReviewId: number) =>
  fetchInstance.delete<{ id: number }>(API_ROUTES.RESIDENCE_REVIEWS.DETAIL(residenceReviewId));
