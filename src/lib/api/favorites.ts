import axiosInstance from "@/lib/api/axiosInstance";
import { API_ROUTES } from "@/lib/constants/apiRoutes";

interface ApiSuccessResponse<T> {
  success: true;
  data: T;
}

interface FavoriteResult {
  moverId: string;
  isFavorite: boolean;
  isNew?: boolean;
}

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
