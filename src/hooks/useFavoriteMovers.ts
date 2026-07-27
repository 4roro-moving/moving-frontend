"use client";

import { getFavoriteMovers, FAVORITE_MOVERS_PAGE_LIMIT } from "@/lib/api/favorites";
import { hasAuthSession } from "@/lib/auth/session";
import { QUERY_KEYS } from "@/lib/constants/queryKeys";
import { withTempLoadingDelay } from "@/lib/utils/tempLoadingDelay";
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
  const enabled = options.enabled ?? hasAuthSession();

  return useApiQuery({
    queryKey: [...QUERY_KEYS.FAVORITES.MOVERS, { page, limit }],
    queryFn: () => withTempLoadingDelay(getFavoriteMovers({ page, limit })),
    enabled,
  });
}
