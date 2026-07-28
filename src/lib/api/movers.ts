import fetchInstance from "@/lib/api/fetchInstance";
import { API_ROUTES } from "@/lib/constants/apiRoutes";
import { MOVERS_ALL_VALUE, MOVERS_PAGE_LIMIT } from "@/lib/utils/moversSearchParams";
import type {
  MoverDetailItem,
  MoverListItem,
  MoversListQuery,
  MoversListResult,
} from "@/types/mover";
import type { MoverReviewItem, MoverReviewListQuery, MoverReviewListResult } from "@/types/review";

/** 기사 상세 리뷰 목록 — 백엔드 listMoverReviewQuerySchema default */
export const MOVER_REVIEW_PAGE_LIMIT = 5;

/** 백엔드 listMoverQuerySchema와 동일한 쿼리 키/값 */
function buildMoversQueryParams(query: MoversListQuery): URLSearchParams {
  const params = new URLSearchParams();
  const page = query.page ?? 1;
  const limit = query.limit ?? MOVERS_PAGE_LIMIT;

  params.set("page", String(page));
  params.set("limit", String(limit));

  if (query.keyword?.trim()) {
    params.set("keyword", query.keyword.trim());
  }
  if (query.sort) {
    params.set("sort", query.sort);
  }
  if (query.serviceArea && query.serviceArea !== MOVERS_ALL_VALUE) {
    params.set("serviceArea", query.serviceArea);
  }
  if (query.moveType) {
    params.set("moveType", query.moveType);
  }

  return params;
}

/** GET /movers — 기사님 목록 (페이지네이션) */
export async function getMovers(query: MoversListQuery): Promise<MoversListResult> {
  const params = buildMoversQueryParams(query);
  return fetchInstance.getPaginated<MoverListItem[]>(
    `${API_ROUTES.MOVERS.ROOT}?${params.toString()}`,
  );
}

/** GET /movers/:moverId — 기사님 상세 */
export async function getMoverDetail(moverId: string): Promise<MoverDetailItem> {
  return fetchInstance.get<MoverDetailItem>(API_ROUTES.MOVERS.DETAIL(moverId));
}

/** GET /movers/:moverId/reviews — 기사님 리뷰 목록 */
export async function getMoverReviews(
  moverId: string,
  query: MoverReviewListQuery = {},
): Promise<MoverReviewListResult> {
  const page = query.page ?? 1;
  const limit = query.limit ?? MOVER_REVIEW_PAGE_LIMIT;
  const params = new URLSearchParams({
    page: String(page),
    limit: String(limit),
  });

  const result = await fetchInstance.getPaginated<MoverReviewItem[]>(
    `${API_ROUTES.MOVERS.REVIEWS(moverId)}?${params.toString()}`,
  );

  return {
    reviews: result.data,
    pagination: result.pagination,
  };
}
