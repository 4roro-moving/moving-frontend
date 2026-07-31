import type { InfiniteData, QueryClient } from "@tanstack/react-query";

import type { FavoriteMoversListResult } from "@/lib/api/favorites";
import { QUERY_KEYS } from "@/lib/constants/queryKeys";

export type FavoriteMoversCacheData =
  FavoriteMoversListResult | InfiniteData<FavoriteMoversListResult>;

function isFavoriteMoversInfiniteData(
  data: unknown,
): data is InfiniteData<FavoriteMoversListResult> {
  return (
    typeof data === "object" &&
    data !== null &&
    "pages" in data &&
    Array.isArray((data as InfiniteData<FavoriteMoversListResult>).pages)
  );
}

function isFavoriteMoversListResult(data: unknown): data is FavoriteMoversListResult {
  return (
    typeof data === "object" &&
    data !== null &&
    "data" in data &&
    "pagination" in data &&
    Array.isArray((data as FavoriteMoversListResult).data)
  );
}

function removeIdsFromFavoriteMoversPage(
  page: FavoriteMoversListResult,
  idSet: Set<string>,
  removedTotalDelta: number,
): FavoriteMoversListResult {
  const data = page.data.filter((mover) => !idSet.has(mover.id));
  const nextTotalCount = Math.max(0, page.pagination.totalCount - removedTotalDelta);

  return {
    ...page,
    data,
    pagination: {
      ...page.pagination,
      totalCount: nextTotalCount,
    },
  };
}

/** 사이드바(유한) · 찜 목록 페이지(infinite) 캐시 공통 제거 패치 */
export function removeIdsFromFavoriteMoversCache(
  data: unknown,
  idSet: Set<string>,
  removedTotalDelta: number,
): unknown {
  if (isFavoriteMoversInfiniteData(data)) {
    let removedFromPages = 0;
    const pages = data.pages.map((page) => {
      const next = removeIdsFromFavoriteMoversPage(page, idSet, removedTotalDelta);
      removedFromPages += page.data.length - next.data.length;
      return next;
    });

    if (removedFromPages === 0 && removedTotalDelta === 0) {
      return data;
    }

    return { ...data, pages };
  }

  if (isFavoriteMoversListResult(data)) {
    const next = removeIdsFromFavoriteMoversPage(data, idSet, removedTotalDelta);
    if (
      next.data.length === data.data.length &&
      next.pagination.totalCount === data.pagination.totalCount
    ) {
      return data;
    }
    return next;
  }

  return data;
}

/** 전체 해제 낙관적 업데이트 — keepIds만 남기고 totalCount 조정 */
export function keepOnlyIdsInFavoriteMoversCache(
  data: unknown,
  keepIds: Set<string>,
  nextTotalCount: number,
): unknown {
  if (isFavoriteMoversInfiniteData(data)) {
    const pages = data.pages.map((page) => {
      const kept = page.data.filter((mover) => keepIds.has(mover.id));

      return {
        ...page,
        data: kept,
        pagination: {
          ...page.pagination,
          totalCount: nextTotalCount,
          hasNext: false,
          nextCursor: null,
        },
      };
    });

    return { ...data, pages };
  }

  if (isFavoriteMoversListResult(data)) {
    const kept = data.data.filter((mover) => keepIds.has(mover.id));

    return {
      ...data,
      data: kept,
      pagination: {
        ...data.pagination,
        totalCount: nextTotalCount,
        hasNext: false,
        nextCursor: null,
      },
    };
  }

  return data;
}

export function patchMoverFavorite<
  T extends { id: string; isFavorite: boolean; favoriteCount: number },
>(mover: T, moverId: string, nextIsFavorite: boolean): T {
  if (mover.id !== moverId) {
    return mover;
  }

  if (mover.isFavorite === nextIsFavorite) {
    return mover;
  }

  const delta = nextIsFavorite ? 1 : -1;

  return {
    ...mover,
    isFavorite: nextIsFavorite,
    favoriteCount: Math.max(0, mover.favoriteCount + delta),
  };
}

export async function invalidateFavoriteRelatedQueries(queryClient: QueryClient): Promise<void> {
  await Promise.all([
    queryClient.invalidateQueries({ queryKey: QUERY_KEYS.ESTIMATES.RECEIVED }),
    queryClient.invalidateQueries({ queryKey: QUERY_KEYS.ESTIMATES.DETAIL_ROOT }),
    queryClient.invalidateQueries({ queryKey: QUERY_KEYS.ESTIMATES.PENDING_LIST_ROOT }),
    queryClient.invalidateQueries({ queryKey: QUERY_KEYS.MOVERS.LIST }),
    queryClient.invalidateQueries({ queryKey: [...QUERY_KEYS.MOVERS.ALL, "detail"] }),
    queryClient.invalidateQueries({ queryKey: QUERY_KEYS.FAVORITES.MOVERS }),
  ]);
}
