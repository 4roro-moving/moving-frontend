import axiosInstance from "@/lib/api/axiosInstance";
import fetchInstance from "@/lib/api/fetchInstance";
import { API_ROUTES } from "@/lib/constants/apiRoutes";
import type { MoverListItem, MoversListResult } from "@/types/mover";

interface ApiSuccessResponse<T> {
  success: true;
  data: T;
}

interface FavoriteResult {
  moverId: string;
  isFavorite: boolean;
  isNew?: boolean;
}

export interface FavoriteMoversListQuery {
  page?: number;
  limit?: number;
}

/** 사이드바 등 찜 목록 기본 page size (백엔드 max 50, default 10) */
export const FAVORITE_MOVERS_PAGE_LIMIT = 10;

// 2026.07.24 정슬기 - [추가] 기사님 찜 추가/해제 API 연동
export async function addFavoriteMover(moverId: string): Promise<FavoriteResult> {
  const { data } = await axiosInstance.post<ApiSuccessResponse<FavoriteResult>>(
    API_ROUTES.FAVORITES.MOVER(moverId),
  );
  return data.data;
}

export async function removeFavoriteMover(moverId: string): Promise<FavoriteResult> {
  const { data } = await axiosInstance.delete<ApiSuccessResponse<FavoriteResult>>(
    API_ROUTES.FAVORITES.MOVER(moverId),
  );
  return data.data;
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
