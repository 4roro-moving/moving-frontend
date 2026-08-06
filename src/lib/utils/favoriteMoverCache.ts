import type { InfiniteData, QueryClient } from "@tanstack/react-query";

import type { FavoriteMoversListResult } from "@/lib/api/favorites";
import type { MoverListItem, MoversListResult } from "@/types/mover";
import {
  getFavoriteMoversScopeQueryKey,
  getMoverDetailScopeQueryKey,
  getMoverListScopeQueryKey,
  QUERY_KEYS,
  type AuthQueryScope,
} from "@/lib/constants/queryKeys";

export type FavoriteMoversCacheData =
  FavoriteMoversListResult | InfiniteData<FavoriteMoversListResult>;

function isFavoriteMoversInfiniteData(
  data: FavoriteMoversCacheData | undefined,
): data is InfiniteData<FavoriteMoversListResult> {
  return (
    typeof data === "object" &&
    data !== null &&
    "pages" in data &&
    Array.isArray((data as InfiniteData<FavoriteMoversListResult>).pages)
  );
}

function isFavoriteMoversListResult(
  data: FavoriteMoversCacheData | undefined,
): data is FavoriteMoversListResult {
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
  data: FavoriteMoversCacheData | undefined,
  idSet: Set<string>,
  removedTotalDelta: number,
): FavoriteMoversCacheData | undefined {
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
  data: FavoriteMoversCacheData | undefined,
  keepIds: Set<string>,
  nextTotalCount: number,
): FavoriteMoversCacheData | undefined {
  if (isFavoriteMoversInfiniteData(data)) {
    const firstPage = data.pages[0];
    if (!firstPage) {
      return data;
    }

    const kept = data.pages.flatMap((page) => page.data.filter((mover) => keepIds.has(mover.id)));

    return {
      ...data,
      pages: [
        {
          ...firstPage,
          data: kept,
          pagination: {
            ...firstPage.pagination,
            totalCount: nextTotalCount,
            hasNext: false,
            nextCursor: null,
          },
        },
      ],
      pageParams: [data.pageParams[0]],
    };
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

export async function invalidateFavoriteRelatedQueries(
  queryClient: QueryClient,
  authScope: AuthQueryScope,
): Promise<void> {
  await Promise.all([
    queryClient.invalidateQueries({ queryKey: QUERY_KEYS.ESTIMATES.RECEIVED }),
    queryClient.invalidateQueries({ queryKey: QUERY_KEYS.ESTIMATES.DETAIL_ROOT }),
    queryClient.invalidateQueries({ queryKey: QUERY_KEYS.ESTIMATES.PENDING_LIST_ROOT }),
    queryClient.invalidateQueries({ queryKey: getMoverListScopeQueryKey(authScope) }),
    queryClient.invalidateQueries({ queryKey: getMoverDetailScopeQueryKey(authScope) }),
    queryClient.invalidateQueries({ queryKey: getFavoriteMoversScopeQueryKey(authScope) }),
  ]);
}

/** moverListScopeQueryKey 캐시(검색/목록 페이지)에서 특정 mover의 최신 스냅샷을 찾음 */
export function findMoverListItemSnapshot(
  queryClient: QueryClient,
  moverListScopeQueryKey: readonly unknown[],
  moverId: string,
): MoverListItem | undefined {
  const queries = queryClient.getQueriesData<InfiniteData<MoversListResult>>({
    queryKey: moverListScopeQueryKey,
  });

  for (const [, data] of queries) {
    if (!data) continue;
    for (const page of data.pages) {
      const found = page.data.find((item) => item.id === moverId);
      if (found) return found;
    }
  }

  return undefined;
}

/** 찜 추가 낙관적 업데이트 — 목록 맨 앞에 삽입 (이미 있으면 스킵) */
export function addMoverToFavoriteMoversCache(
  data: FavoriteMoversCacheData | undefined,
  mover: MoverListItem,
): FavoriteMoversCacheData | undefined {
  const entry: MoverListItem = { ...mover, isFavorite: true };

  if (isFavoriteMoversInfiniteData(data)) {
    const firstPage = data.pages[0];
    if (!firstPage) {
      return data;
    }
    if (data.pages.some((page) => page.data.some((item) => item.id === entry.id))) {
       return data;
     }
    return {
      ...data,
      pages: [
        {
          ...firstPage,
          data: [entry, ...firstPage.data],
          pagination: {
            ...firstPage.pagination,
            totalCount: firstPage.pagination.totalCount + 1,
          },
        },
        ...data.pages.slice(1),
      ],
    };
  }

  if (isFavoriteMoversListResult(data)) {
    if (data.data.some((item) => item.id === entry.id)) {
      return data;
    }

    return {
      ...data,
      data: [entry, ...data.data],
      pagination: {
        ...data.pagination,
        totalCount: data.pagination.totalCount + 1,
      },
    };
  }

  return data;
}
