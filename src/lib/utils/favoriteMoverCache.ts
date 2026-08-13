import type { InfiniteData, QueryClient } from "@tanstack/react-query";

import type { FavoriteMoversListResult } from "@/lib/api/favorites";
import {
  getFavoriteMoversScopeQueryKey,
  getMoverDetailQueryKey,
  getMoverDetailScopeQueryKey,
  getMoverListScopeQueryKey,
  QUERY_KEYS,
  type AuthQueryScope,
} from "@/lib/constants/queryKeys";
import type {
  EstimateDetail,
  PendingEstimateSectionListResult,
  ReceivedEstimatePanel,
} from "@/types/estimate";
import type { MoverListItem, MoversListResult } from "@/types/mover";
import type { MoverDetail } from "@/types/moverDetail";

export type FavoriteMoversCacheData =
  FavoriteMoversListResult | InfiniteData<FavoriteMoversListResult>;

export interface FavoriteMutationContext {
  previousReceived: ReceivedEstimatePanel[] | undefined;
  previousDetails: [readonly unknown[], EstimateDetail | undefined][];
  previousPendingLists: [readonly unknown[], PendingEstimateSectionListResult | undefined][];
  previousMoverLists: [readonly unknown[], InfiniteData<MoversListResult> | undefined][];
  previousFavoriteMovers: [readonly unknown[], FavoriteMoversCacheData | undefined][];
  previousMoverDetail: MoverDetail | undefined;
}

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

interface InvalidateFavoriteRelatedQueriesOptions {
  throwOnError?: boolean;
}

/**
 * 찜 상태가 포함된 관련 캐시를 무효화합니다.
 * `throwOnError`가 true이면 refetch 실패를 호출부에서 처리할 수 있도록 전달합니다.
 */
export async function invalidateFavoriteRelatedQueries(
  queryClient: QueryClient,
  authScope: AuthQueryScope,
  options: InvalidateFavoriteRelatedQueriesOptions = {},
): Promise<void> {
  const invalidateOptions = {
    throwOnError: options.throwOnError ?? false,
  };

  await Promise.all([
    queryClient.invalidateQueries({ queryKey: QUERY_KEYS.ESTIMATES.RECEIVED }, invalidateOptions),
    queryClient.invalidateQueries(
      { queryKey: QUERY_KEYS.ESTIMATES.DETAIL_ROOT },
      invalidateOptions,
    ),
    queryClient.invalidateQueries(
      { queryKey: QUERY_KEYS.ESTIMATES.PENDING_LIST_ROOT },
      invalidateOptions,
    ),
    queryClient.invalidateQueries(
      { queryKey: getMoverListScopeQueryKey(authScope) },
      invalidateOptions,
    ),
    queryClient.invalidateQueries(
      { queryKey: getMoverDetailScopeQueryKey(authScope) },
      invalidateOptions,
    ),
    queryClient.invalidateQueries(
      { queryKey: getFavoriteMoversScopeQueryKey(authScope) },
      invalidateOptions,
    ),
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

      if (found) {
        return found;
      }
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

/**
 * 단건 찜 mutation 전 관련 캐시를 스냅샷으로 저장하고
 * 원하는 찜 상태를 낙관적으로 반영합니다.
 */
export async function applyFavoriteOptimisticUpdate(
  queryClient: QueryClient,
  authScope: AuthQueryScope,
  moverId: string,
  nextIsFavorite: boolean,
): Promise<FavoriteMutationContext> {
  const moverListScopeQueryKey = getMoverListScopeQueryKey(authScope);
  const favoriteMoversScopeQueryKey = getFavoriteMoversScopeQueryKey(authScope);
  const moverDetailQueryKey = getMoverDetailQueryKey(authScope, moverId);

  // 찜 추가인 경우 favorite 목록에 넣기 위한 현재 mover 스냅샷 확보
  const moverSnapshot = nextIsFavorite
    ? findMoverListItemSnapshot(queryClient, moverListScopeQueryKey, moverId)
    : undefined;

  await Promise.all([
    queryClient.cancelQueries({
      queryKey: QUERY_KEYS.ESTIMATES.RECEIVED,
    }),
    queryClient.cancelQueries({
      queryKey: QUERY_KEYS.ESTIMATES.DETAIL_ROOT,
    }),
    queryClient.cancelQueries({
      queryKey: QUERY_KEYS.ESTIMATES.PENDING_LIST_ROOT,
    }),
    queryClient.cancelQueries({
      queryKey: moverListScopeQueryKey,
    }),
    queryClient.cancelQueries({
      queryKey: moverDetailQueryKey,
    }),
    queryClient.cancelQueries({
      queryKey: favoriteMoversScopeQueryKey,
    }),
  ]);

  const previousReceived = queryClient.getQueryData<ReceivedEstimatePanel[]>(
    QUERY_KEYS.ESTIMATES.RECEIVED,
  );

  const previousDetails = queryClient.getQueriesData<EstimateDetail>({
    queryKey: QUERY_KEYS.ESTIMATES.DETAIL_ROOT,
  });

  const previousPendingLists = queryClient.getQueriesData<PendingEstimateSectionListResult>({
    queryKey: QUERY_KEYS.ESTIMATES.PENDING_LIST_ROOT,
  });

  const previousMoverLists = queryClient.getQueriesData<InfiniteData<MoversListResult>>({
    queryKey: moverListScopeQueryKey,
  });

  const previousFavoriteMovers = queryClient.getQueriesData<FavoriteMoversCacheData>({
    queryKey: favoriteMoversScopeQueryKey,
  });

  const previousMoverDetail = queryClient.getQueryData<MoverDetail>(moverDetailQueryKey);

  queryClient.setQueryData<ReceivedEstimatePanel[]>(QUERY_KEYS.ESTIMATES.RECEIVED, (panels) => {
    if (!panels) {
      return panels;
    }

    return panels.map((panel) => ({
      ...panel,
      estimates: panel.estimates.map((estimate) => ({
        ...estimate,
        mover: patchMoverFavorite(estimate.mover, moverId, nextIsFavorite),
      })),
    }));
  });

  queryClient.setQueriesData<EstimateDetail>(
    {
      queryKey: QUERY_KEYS.ESTIMATES.DETAIL_ROOT,
    },
    (detail) => {
      if (!detail?.mover) {
        return detail;
      }

      return {
        ...detail,
        mover: patchMoverFavorite(detail.mover, moverId, nextIsFavorite),
      };
    },
  );

  queryClient.setQueriesData<PendingEstimateSectionListResult>(
    {
      queryKey: QUERY_KEYS.ESTIMATES.PENDING_LIST_ROOT,
    },
    (list) => {
      if (!list || !Array.isArray(list.sections)) {
        return list;
      }

      return {
        ...list,
        sections: list.sections.map((section) => ({
          ...section,
          estimates: section.estimates.map((estimate) => ({
            ...estimate,
            mover: patchMoverFavorite(estimate.mover, moverId, nextIsFavorite),
          })),
        })),
      };
    },
  );

  queryClient.setQueriesData<InfiniteData<MoversListResult>>(
    {
      queryKey: moverListScopeQueryKey,
    },
    (list) => {
      if (!list) {
        return list;
      }

      return {
        ...list,
        pages: list.pages.map((page) => ({
          ...page,
          data: page.data.map((mover) => patchMoverFavorite(mover, moverId, nextIsFavorite)),
        })),
      };
    },
  );

  if (!nextIsFavorite) {
    queryClient.setQueriesData<FavoriteMoversCacheData>(
      {
        queryKey: favoriteMoversScopeQueryKey,
      },
      (list) => removeIdsFromFavoriteMoversCache(list, new Set([moverId]), 1),
    );
  } else if (moverSnapshot) {
    queryClient.setQueriesData<FavoriteMoversCacheData>(
      {
        queryKey: favoriteMoversScopeQueryKey,
      },
      (list) => addMoverToFavoriteMoversCache(list, moverSnapshot),
    );
  }

  queryClient.setQueryData<MoverDetail>(moverDetailQueryKey, (detail) => {
    if (!detail) {
      return detail;
    }

    return patchMoverFavorite(detail, moverId, nextIsFavorite);
  });

  return {
    previousReceived,
    previousDetails,
    previousPendingLists,
    previousMoverLists,
    previousFavoriteMovers,
    previousMoverDetail,
  };
}

interface FavoriteState {
  isFavorite: boolean;
  favoriteCount: number;
}

function toFavoriteState(
  mover: { isFavorite: boolean; favoriteCount: number } | undefined,
): FavoriteState | undefined {
  if (!mover) {
    return undefined;
  }

  return {
    isFavorite: mover.isFavorite,
    favoriteCount: mover.favoriteCount,
  };
}

function restoreMoverFavorite<T extends { id: string; isFavorite: boolean; favoriteCount: number }>(
  mover: T,
  moverId: string,
  previousState: FavoriteState,
): T {
  if (mover.id !== moverId) {
    return mover;
  }

  if (
    mover.isFavorite === previousState.isFavorite &&
    mover.favoriteCount === previousState.favoriteCount
  ) {
    return mover;
  }

  return {
    ...mover,
    isFavorite: previousState.isFavorite,
    favoriteCount: previousState.favoriteCount,
  };
}

function findMoverInFavoriteMoversCache(
  data: FavoriteMoversCacheData | undefined,
  moverId: string,
): MoverListItem | undefined {
  if (isFavoriteMoversInfiniteData(data)) {
    for (const page of data.pages) {
      const mover = page.data.find((item) => item.id === moverId);
      if (mover) {
        return mover;
      }
    }

    return undefined;
  }

  if (isFavoriteMoversListResult(data)) {
    return data.data.find((item) => item.id === moverId);
  }

  return undefined;
}

function findPreviousFavoriteState(
  context: FavoriteMutationContext,
  moverId: string,
): FavoriteState | undefined {
  const detailState =
    context.previousMoverDetail?.id === moverId
      ? toFavoriteState(context.previousMoverDetail)
      : undefined;

  if (detailState) {
    return detailState;
  }

  for (const [, data] of context.previousMoverLists) {
    if (!data) continue;

    for (const page of data.pages) {
      const mover = page.data.find((item) => item.id === moverId);
      const state = toFavoriteState(mover);

      if (state) {
        return state;
      }
    }
  }

  for (const [, data] of context.previousFavoriteMovers) {
    const state = toFavoriteState(findMoverInFavoriteMoversCache(data, moverId));

    if (state) {
      return state;
    }
  }

  for (const panel of context.previousReceived ?? []) {
    for (const estimate of panel.estimates) {
      const state = toFavoriteState(estimate.mover.id === moverId ? estimate.mover : undefined);

      if (state) {
        return state;
      }
    }
  }

  for (const [, detail] of context.previousDetails) {
    const state = toFavoriteState(detail?.mover?.id === moverId ? detail.mover : undefined);

    if (state) {
      return state;
    }
  }

  for (const [, list] of context.previousPendingLists) {
    if (!list || !Array.isArray(list.sections)) continue;

    for (const section of list.sections) {
      for (const estimate of section.estimates) {
        const state = toFavoriteState(estimate.mover.id === moverId ? estimate.mover : undefined);

        if (state) {
          return state;
        }
      }
    }
  }

  return undefined;
}

/** 최신 단건 찜 mutation 실패 시 해당 mover의 낙관적 변경만 복구합니다. */
export function rollbackFavoriteOptimisticUpdate(
  queryClient: QueryClient,
  authScope: AuthQueryScope,
  moverId: string,
  context: FavoriteMutationContext,
): void {
  const previousState = findPreviousFavoriteState(context, moverId);

  if (previousState) {
    queryClient.setQueryData<ReceivedEstimatePanel[]>(QUERY_KEYS.ESTIMATES.RECEIVED, (panels) => {
      if (!panels) {
        return panels;
      }

      return panels.map((panel) => ({
        ...panel,
        estimates: panel.estimates.map((estimate) => ({
          ...estimate,
          mover: restoreMoverFavorite(estimate.mover, moverId, previousState),
        })),
      }));
    });

    queryClient.setQueriesData<EstimateDetail>(
      { queryKey: QUERY_KEYS.ESTIMATES.DETAIL_ROOT },
      (detail) => {
        if (!detail?.mover) {
          return detail;
        }

        return {
          ...detail,
          mover: restoreMoverFavorite(detail.mover, moverId, previousState),
        };
      },
    );

    queryClient.setQueriesData<PendingEstimateSectionListResult>(
      { queryKey: QUERY_KEYS.ESTIMATES.PENDING_LIST_ROOT },
      (list) => {
        if (!list || !Array.isArray(list.sections)) {
          return list;
        }

        return {
          ...list,
          sections: list.sections.map((section) => ({
            ...section,
            estimates: section.estimates.map((estimate) => ({
              ...estimate,
              mover: restoreMoverFavorite(estimate.mover, moverId, previousState),
            })),
          })),
        };
      },
    );

    queryClient.setQueriesData<InfiniteData<MoversListResult>>(
      { queryKey: getMoverListScopeQueryKey(authScope) },
      (list) => {
        if (!list) {
          return list;
        }

        return {
          ...list,
          pages: list.pages.map((page) => ({
            ...page,
            data: page.data.map((mover) => restoreMoverFavorite(mover, moverId, previousState)),
          })),
        };
      },
    );
  }

  context.previousFavoriteMovers.forEach(([queryKey, previousData]) => {
    const previousMover = findMoverInFavoriteMoversCache(previousData, moverId);

    queryClient.setQueryData<FavoriteMoversCacheData>(queryKey, (currentData) => {
      const currentMover = findMoverInFavoriteMoversCache(currentData, moverId);

      if (previousMover) {
        return addMoverToFavoriteMoversCache(currentData, previousMover);
      }

      if (!currentMover) {
        return currentData;
      }

      return removeIdsFromFavoriteMoversCache(currentData, new Set([moverId]), 1);
    });
  });

  queryClient.setQueryData(getMoverDetailQueryKey(authScope, moverId), context.previousMoverDetail);
}
