"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { useEffect, useRef } from "react";

import { useLoginRequiredModal } from "@/components/auth/LoginRequiredModalProvider";
import { useAuthQueryScope } from "@/hooks/useAuthQueryScope";
import { useCustomerAuthReady } from "@/hooks/useCustomerAuthReady";
import { addFavoriteMover, removeFavoriteMover } from "@/lib/api/favorites";
import { getApiErrorMessage } from "@/lib/api/getApiErrorMessage";
import { getLoginRedirectPath, hasAuthSession } from "@/lib/auth/session";
import { ERROR_CODES } from "@/lib/constants/errorCodes";
import {
  applyFavoriteOptimisticUpdate,
  invalidateFavoriteRelatedQueries,
} from "@/lib/utils/favoriteMoverCache";
import { ApiError } from "@/types/api";

export { useBulkRemoveFavoriteMovers } from "@/hooks/useBulkRemoveFavoriteMovers";

const LOGIN_REQUIRED_MESSAGE = "로그인이 필요한 서비스입니다.";
const CUSTOMER_REQUIRED_MESSAGE = "고객만 이용할 수 있는 서비스입니다.";
const FAVORITE_SYNC_ERROR_MESSAGE = "찜 상태를 확인하지 못했습니다. 잠시 후 다시 확인해주세요.";

interface FavoriteMoverVariables {
  moverId: string;
  nextIsFavorite: boolean;
}

interface UseFavoriteMoverOptions {
  onError?: (message: string) => void;
}

type AuthScope = ReturnType<typeof useAuthQueryScope>["authScope"];

interface FavoriteSyncState {
  confirmedState: boolean;
  desiredState: boolean;
  isRequestInFlight: boolean;
}

function isUnauthorizedError(error: unknown): boolean {
  return (
    error instanceof ApiError &&
    (error.status === ERROR_CODES.UNAUTHORIZED.status ||
      error.code === ERROR_CODES.UNAUTHORIZED.code)
  );
}

function getStateKey(authScope: AuthScope, moverId: string): string {
  return `${authScope}:${moverId}`;
}

/** 마지막 사용자 의도만 서버 상태로 수렴시키는 단건 찜 mutation */
export function useFavoriteMover(options?: UseFavoriteMoverOptions) {
  const queryClient = useQueryClient();
  const router = useRouter();
  const loginRequiredModal = useLoginRequiredModal();
  const auth = useCustomerAuthReady();
  const { authScope } = useAuthQueryScope();
  const authScopeRef = useRef(authScope);
  const onErrorRef = useRef(options?.onError);
  const statesRef = useRef(new Map<string, FavoriteSyncState>());
  const cacheUpdateChainRef = useRef(Promise.resolve());
  const isCustomer = auth.user?.role === "CUSTOMER";
  const canToggleFavorite = !auth.isPending && (!auth.isAuthenticated || isCustomer);

  useEffect(() => {
    authScopeRef.current = authScope;
  }, [authScope]);
  useEffect(() => {
    onErrorRef.current = options?.onError;
  }, [options?.onError]);

  const requireLogin = () => {
    if (loginRequiredModal) {
      loginRequiredModal.openLoginRequiredModal();
      return;
    }
    router.push(getLoginRedirectPath());
  };

  const enqueueCacheUpdate = (scope: AuthScope, moverId: string, isFavorite: boolean) => {
    const next = cacheUpdateChainRef.current
      .catch(() => undefined)
      .then(() => applyFavoriteOptimisticUpdate(queryClient, scope, moverId, isFavorite))
      .then(() => undefined);
    cacheUpdateChainRef.current = next;
    return next;
  };

  const reconcile = async (scope: AuthScope) => {
    try {
      await invalidateFavoriteRelatedQueries(queryClient, scope, { throwOnError: true });
    } catch {
      onErrorRef.current?.(FAVORITE_SYNC_ERROR_MESSAGE);
    }
  };

  const mutation = useMutation({
    mutationFn: ({ moverId, nextIsFavorite }: FavoriteMoverVariables) =>
      nextIsFavorite ? addFavoriteMover(moverId) : removeFavoriteMover(moverId),
  });

  const flushDesiredState = (scope: AuthScope, moverId: string) => {
    const key = getStateKey(scope, moverId);
    const state = statesRef.current.get(key);
    if (
      !state ||
      state.isRequestInFlight ||
      state.confirmedState === state.desiredState ||
      authScopeRef.current !== scope
    ) {
      return;
    }

    state.isRequestInFlight = true;
    const requestedState = state.desiredState;
    mutation.mutate(
      { moverId, nextIsFavorite: requestedState },
      {
        onSuccess: (result) => {
          if (authScopeRef.current !== scope) return;
          const current = statesRef.current.get(key);
          if (current) current.confirmedState = result.isFavorite;
        },
        onError: (error) => {
          if (authScopeRef.current !== scope) return;
          const current = statesRef.current.get(key);
          if (!current) return;

          current.desiredState = current.confirmedState;
          void enqueueCacheUpdate(scope, moverId, current.confirmedState);
          if (isUnauthorizedError(error)) requireLogin();
          else onErrorRef.current?.(getApiErrorMessage(error));
        },
        onSettled: (result, error) => {
          const current = statesRef.current.get(key);
          if (!current) return;
          current.isRequestInFlight = false;

          const shouldReconcile =
            !isUnauthorizedError(error) &&
            (Boolean(error) || result?.isFavorite !== requestedState);
          if (shouldReconcile) void reconcile(scope);

          if (authScopeRef.current !== scope) {
            statesRef.current.delete(key);
          } else if (current.confirmedState !== current.desiredState) {
            flushDesiredState(scope, moverId);
          } else {
            statesRef.current.delete(key);
          }
        },
      },
    );
  };

  const mutate = ({ moverId, nextIsFavorite }: FavoriteMoverVariables) => {
    if (auth.isPending) return;
    if (!auth.isAuthenticated || !hasAuthSession()) {
      requireLogin();
      return;
    }
    if (!isCustomer) return;

    const key = getStateKey(authScope, moverId);
    const state = statesRef.current.get(key) ?? {
      confirmedState: !nextIsFavorite,
      desiredState: nextIsFavorite,
      isRequestInFlight: false,
    };
    state.desiredState = nextIsFavorite;
    statesRef.current.set(key, state);
    void enqueueCacheUpdate(authScope, moverId, nextIsFavorite).then(() => {
      flushDesiredState(authScope, moverId);
    });
  };

  const mutateAsync = (variables: FavoriteMoverVariables) => {
    if (auth.isPending) return Promise.reject(new Error(LOGIN_REQUIRED_MESSAGE));
    if (!auth.isAuthenticated || !hasAuthSession()) {
      requireLogin();
      return Promise.reject(new Error(LOGIN_REQUIRED_MESSAGE));
    }
    if (!isCustomer) return Promise.reject(new Error(CUSTOMER_REQUIRED_MESSAGE));
    mutate(variables);
    return Promise.resolve();
  };

  return { ...mutation, canToggleFavorite, mutate, mutateAsync };
}
