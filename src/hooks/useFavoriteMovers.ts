"use client";

import { getFavoriteMovers, FAVORITE_MOVERS_PAGE_LIMIT } from "@/lib/api/favorites";
import { QUERY_KEYS } from "@/lib/constants/queryKeys";
import { useApiQuery } from "@/hooks/queries/useApiQuery";

interface UseFavoriteMoversOptions {
  page?: number;
  limit?: number;
  enabled?: boolean;
}

/** GET /favorites/movers — 로그인 고객의 찜한 기사님 목록 */
export function useFavoriteMovers(options: UseFavoriteMoversOptions = {}) {
  const page = options.page ?? 1;
  const limit = options.limit ?? FAVORITE_MOVERS_PAGE_LIMIT;
  // hasAuthSession()은 SSR에서 false라 기본값으로 쓰지 않음. 호출부에서 명시.
  const enabled = options.enabled ?? false;

  return useApiQuery({
    queryKey: [...QUERY_KEYS.FAVORITES.MOVERS, { page, limit }],
    queryFn: () => getFavoriteMovers({ page, limit }),
    enabled,
  });
}
