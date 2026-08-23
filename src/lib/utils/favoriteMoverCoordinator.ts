import type { QueryClient } from "@tanstack/react-query";

import { addFavoriteMover, removeFavoriteMover } from "@/lib/api/favorites";
import { getApiErrorMessage } from "@/lib/api/getApiErrorMessage";
import { ERROR_CODES } from "@/lib/constants/errorCodes";
import type { AuthQueryScope } from "@/lib/constants/queryKeys";
import {
  applyFavoriteOptimisticUpdate,
  invalidateFavoriteRelatedQueries,
} from "@/lib/utils/favoriteMoverCache";
import { ApiError } from "@/types/api";

const FAVORITE_SYNC_ERROR_MESSAGE = "찜 상태를 확인하지 못했습니다. 잠시 후 다시 확인해주세요.";

interface FavoriteCoordinatorHandlers {
  isAuthScopeCurrent: () => boolean;
  onUnauthorized: () => void;
  onError?: (message: string) => void;
}

interface FavoriteSyncState {
  authScope: AuthQueryScope;
  moverId: string;
  queryClient: QueryClient;
  confirmedState: boolean;
  desiredState: boolean;
  isRequestInFlight: boolean;
  pendingCacheUpdates: number;
  handlers: FavoriteCoordinatorHandlers;
}

interface SyncFavoriteMoverOptions extends FavoriteCoordinatorHandlers {
  authScope: AuthQueryScope;
  moverId: string;
  nextIsFavorite: boolean;
  queryClient: QueryClient;
}

const syncStates = new Map<string, FavoriteSyncState>();
let cacheUpdateChain = Promise.resolve();

function getStateKey(authScope: AuthQueryScope, moverId: string): string {
  return `${authScope}:${moverId}`;
}

function isUnauthorizedError(error: unknown): boolean {
  return (
    error instanceof ApiError &&
    (error.status === ERROR_CODES.UNAUTHORIZED.status ||
      error.code === ERROR_CODES.UNAUTHORIZED.code)
  );
}

function isCurrentState(state: FavoriteSyncState): boolean {
  return syncStates.get(getStateKey(state.authScope, state.moverId)) === state;
}

function removeState(state: FavoriteSyncState): void {
  if (!isCurrentState(state)) return;
  syncStates.delete(getStateKey(state.authScope, state.moverId));
}

function enqueueCacheUpdate(state: FavoriteSyncState, isFavorite: boolean): Promise<void> {
  state.pendingCacheUpdates += 1;
  const update = cacheUpdateChain
    .catch(() => undefined)
    .then(() =>
      applyFavoriteOptimisticUpdate(state.queryClient, state.authScope, state.moverId, isFavorite),
    )
    .then(() => undefined);
  cacheUpdateChain = update.catch(() => undefined);

  return update.finally(() => {
    state.pendingCacheUpdates -= 1;
    flushDesiredState(state);
  });
}

async function reconcile(state: FavoriteSyncState): Promise<void> {
  try {
    await invalidateFavoriteRelatedQueries(state.queryClient, state.authScope, {
      throwOnError: true,
    });
  } catch {
    state.handlers.onError?.(FAVORITE_SYNC_ERROR_MESSAGE);
  }
}

function flushDesiredState(state: FavoriteSyncState): void {
  if (!isCurrentState(state) || state.isRequestInFlight) return;

  if (!state.handlers.isAuthScopeCurrent()) {
    removeState(state);
    return;
  }

  if (state.confirmedState === state.desiredState) {
    if (state.pendingCacheUpdates === 0) removeState(state);
    return;
  }

  state.isRequestInFlight = true;
  const requestedState = state.desiredState;

  void (async () => {
    let requestError: unknown;
    let shouldReconcile = false;

    try {
      const result = requestedState
        ? await addFavoriteMover(state.moverId)
        : await removeFavoriteMover(state.moverId);
      state.confirmedState = result.isFavorite;
      shouldReconcile = result.isFavorite !== requestedState;
    } catch (error) {
      requestError = error;
      state.desiredState = state.confirmedState;
      await enqueueCacheUpdate(state, state.confirmedState).catch(() => undefined);

      if (isUnauthorizedError(error)) state.handlers.onUnauthorized();
      else state.handlers.onError?.(getApiErrorMessage(error));
      shouldReconcile = !isUnauthorizedError(error);
    }

    state.isRequestInFlight = false;

    if (!state.handlers.isAuthScopeCurrent()) {
      removeState(state);
      return;
    }

    if (shouldReconcile) await reconcile(state);

    if (requestError) {
      removeState(state);
      return;
    }

    flushDesiredState(state);
  })();
}

/** 같은 기사님의 최종 찜 의도를 모든 Hook 인스턴스에서 공유해 서버 상태로 수렴시킨다. */
export function syncFavoriteMover(options: SyncFavoriteMoverOptions): void {
  const { authScope, moverId, nextIsFavorite, queryClient, ...handlers } = options;
  const key = getStateKey(authScope, moverId);
  let state = syncStates.get(key);

  if (!state) {
    state = {
      authScope,
      moverId,
      queryClient,
      confirmedState: !nextIsFavorite,
      desiredState: nextIsFavorite,
      isRequestInFlight: false,
      pendingCacheUpdates: 0,
      handlers,
    };
    syncStates.set(key, state);
  }

  state.queryClient = queryClient;
  state.handlers = handlers;
  state.desiredState = nextIsFavorite;
  void enqueueCacheUpdate(state, nextIsFavorite).catch(() => removeState(state));
}

export function resetFavoriteMoverCoordinatorForTests(): void {
  syncStates.clear();
  cacheUpdateChain = Promise.resolve();
}
