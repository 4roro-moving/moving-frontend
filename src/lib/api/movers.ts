import fetchInstance from "@/lib/api/fetchInstance";
import { API_ROUTES } from "@/lib/constants/apiRoutes";
import { MOVERS_ALL_VALUE, MOVERS_PAGE_LIMIT } from "@/lib/utils/moversSearchParams";
import type { MoverListItem, MoversListQuery, MoversListResult } from "@/types/mover";

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
  return fetchInstance.getPaginated<MoverListItem[]>(`${API_ROUTES.MOVERS}?${params.toString()}`);
}
