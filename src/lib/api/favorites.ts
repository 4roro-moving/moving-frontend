import fetchInstance from "@/lib/api/fetchInstance";
import { API_ROUTES } from "@/lib/constants/apiRoutes";
import type { MoverListItem } from "@/types/mover";

interface FavoriteResult {
  moverId: string;
  isFavorite: boolean;
  isNew?: boolean;
}

export interface FavoriteMoversListQuery {
  cursor?: string;
  limit?: number;
}

export interface FavoriteMoversPagination {
  limit: number;
  totalCount: number;
  hasNext: boolean;
  nextCursor: string | null;
}

export interface FavoriteMoversListResult {
  data: MoverListItem[];
  pagination: FavoriteMoversPagination;
}

/** DELETE /favorites/movers — moverIds 또는 all(+excludedIds) */
export type BulkDeleteFavoriteMoversBody =
  | {
      moverIds: string[];
      all?: false;
      excludedIds?: never;
    }
  | {
      all: true;
      excludedIds?: string[];
      moverIds?: never;
    };

export interface BulkDeleteFavoriteMoversResult {
  deletedCount: number;
}

/** 찜 목록 API 기본 조회 개수 */
export const FAVORITE_MOVERS_PAGE_LIMIT = 5;

/** PC 기사님 찾기 사이드바에 표시하는 최대 인원 */
export const FAVORITE_MOVERS_SIDEBAR_LIMIT = 3;

/** 한 번에 찜 해제 가능한 기사님 수 */
export const MAX_BULK_FAVORITE_MOVERS = 100;

// 2026.07.24 정슬기 - [추가] 기사님 찜 추가/해제 API 연동
// 2026.07.27 - [수정] axios → fetchInstance 전환 (Bearer·에러 타입 통일)
export async function addFavoriteMover(moverId: string): Promise<FavoriteResult> {
  return fetchInstance.post<FavoriteResult>(API_ROUTES.FAVORITES.MOVER(moverId));
}

export async function removeFavoriteMover(moverId: string): Promise<FavoriteResult> {
  return fetchInstance.delete<FavoriteResult>(API_ROUTES.FAVORITES.MOVER(moverId));
}

/** DELETE /favorites/movers — 찜한 기사님 일괄 해제 */
export async function removeFavoriteMoversBulk(
  body: BulkDeleteFavoriteMoversBody,
): Promise<BulkDeleteFavoriteMoversResult> {
  return fetchInstance.delete<BulkDeleteFavoriteMoversResult, BulkDeleteFavoriteMoversBody>(
    API_ROUTES.FAVORITES.MOVERS,
    body,
  );
}

/** GET /favorites/movers — 찜한 기사님 목록 (페이지네이션) */
export async function getFavoriteMovers(
  query: FavoriteMoversListQuery = {},
): Promise<FavoriteMoversListResult> {
  const params = new URLSearchParams();
  params.set("limit", String(query.limit ?? FAVORITE_MOVERS_PAGE_LIMIT));
  if (query.cursor) params.set("cursor", query.cursor);

  return fetchInstance.getPaginated<MoverListItem[], FavoriteMoversPagination>(
    `${API_ROUTES.FAVORITES.MOVERS}?${params.toString()}`,
  );
}
