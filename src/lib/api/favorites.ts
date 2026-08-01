import fetchInstance from "@/lib/api/fetchInstance";
import { API_ROUTES } from "@/lib/constants/apiRoutes";
import type { MoverListItem, MoversListResult } from "@/types/mover";

interface FavoriteResult {
  moverId: string;
  isFavorite: boolean;
  isNew?: boolean;
}

export interface FavoriteMoversListQuery {
  page?: number;
  limit?: number;
}

/** 찜 목록 API 기본 page size */
export const FAVORITE_MOVERS_PAGE_LIMIT = 5;

/** PC 기사님 찾기 사이드바에 표시하는 최대 인원 */
export const FAVORITE_MOVERS_SIDEBAR_LIMIT = 3;

// 2026.07.24 정슬기 - [추가] 기사님 찜 추가/해제 API 연동
// 2026.07.27 - [수정] axios → fetchInstance 전환 (Bearer·에러 타입 통일)
export async function addFavoriteMover(moverId: string): Promise<FavoriteResult> {
  return fetchInstance.post<FavoriteResult>(API_ROUTES.FAVORITES.MOVER(moverId));
}

export async function removeFavoriteMover(moverId: string): Promise<FavoriteResult> {
  return fetchInstance.delete<FavoriteResult>(API_ROUTES.FAVORITES.MOVER(moverId));
}

/** GET /favorites/movers — 찜한 기사님 목록 (페이지네이션) */
export async function getFavoriteMovers(
  query: FavoriteMoversListQuery = {},
): Promise<MoversListResult> {
  const params = new URLSearchParams();
  params.set("page", String(query.page ?? 1));
  params.set("limit", String(query.limit ?? FAVORITE_MOVERS_PAGE_LIMIT));

  return fetchInstance.getPaginated<MoverListItem[]>(
    `${API_ROUTES.FAVORITES.MOVERS}?${params.toString()}`,
  );
}

/** 찜한 기사님 전체 id 수집 (페이지 순회). bulk API 부재 시 클라이언트에서 사용 */
export async function fetchAllFavoriteMoverIds(): Promise<string[]> {
  const limit = FAVORITE_MOVERS_PAGE_LIMIT;
  const firstPage = await getFavoriteMovers({ page: 1, limit });
  const ids = firstPage.data.map((mover) => mover.id);
  const totalPages = Math.max(1, firstPage.pagination.totalPages);

  if (totalPages <= 1) {
    return ids;
  }

  const remainingPages = await Promise.all(
    Array.from({ length: totalPages - 1 }, (_, index) =>
      getFavoriteMovers({ page: index + 2, limit }),
    ),
  );

  for (const pageResult of remainingPages) {
    for (const mover of pageResult.data) {
      ids.push(mover.id);
    }
  }

  return ids;
}
