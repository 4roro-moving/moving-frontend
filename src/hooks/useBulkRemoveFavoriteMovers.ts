"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useMemo, useRef } from "react";

import { useLoginRequiredModal } from "@/components/auth/LoginRequiredModalProvider";
import { useAuthQueryScope } from "@/hooks/useAuthQueryScope";
import { useCustomerAuthReady } from "@/hooks/useCustomerAuthReady";
import { removeFavoriteMoversBulk } from "@/lib/api/favorites";
import { getApiErrorMessage } from "@/lib/api/getApiErrorMessage";
import { getLoginRedirectPath, hasAuthSession } from "@/lib/auth/session";
import { getFavoriteMoversScopeQueryKey } from "@/lib/constants/queryKeys";
import {
  invalidateFavoriteRelatedQueries,
  keepOnlyIdsInFavoriteMoversCache,
  removeIdsFromFavoriteMoversCache,
  type FavoriteMoversCacheData,
} from "@/lib/utils/favoriteMoverCache";
import { ApiError } from "@/types/api";

const LOGIN_REQUIRED_MESSAGE = "로그인이 필요한 서비스입니다.";
const CUSTOMER_REQUIRED_MESSAGE = "고객만 이용할 수 있는 서비스입니다.";
const ALL_FAILED_MESSAGE = "선택한 기사님을 삭제하지 못했습니다. 잠시 후 다시 시도해주세요.";

function isUnauthorizedError(error: unknown): boolean {
  if (error instanceof ApiError) {
    return error.status === 401 || error.code === "UNAUTHORIZED";
  }

  return false;
}

/** ids: 선택 해제 / all: 전체 해제(제외 id 포함 가능) */
export type BulkRemoveFavoriteVariables =
  { mode: "ids"; moverIds: string[] } | { mode: "all"; excludedIds: string[] };

interface UseBulkRemoveFavoriteMoversOptions {
  onError?: (message: string) => void;
}

interface BulkRemoveFavoriteContext {
  previousFavoriteMovers: [readonly unknown[], FavoriteMoversCacheData | undefined][];
}

/** 찜한 기사님 일괄 해제 — DELETE /favorites/movers bulk + 캐시 무효화 */
export function useBulkRemoveFavoriteMovers(options?: UseBulkRemoveFavoriteMoversOptions) {
  const queryClient = useQueryClient();
  const router = useRouter();
  const loginRequiredModal = useLoginRequiredModal();
  const auth = useCustomerAuthReady();
  const isCustomer = auth.user?.role === "CUSTOMER";
  const { authScope } = useAuthQueryScope();
  const favoriteMoversScopeQueryKey = getFavoriteMoversScopeQueryKey(authScope);
  const onErrorRef = useRef(options?.onError);

  useEffect(() => {
    onErrorRef.current = options?.onError;
  }, [options?.onError]);

  const requireLogin = useCallback(() => {
    if (loginRequiredModal) {
      loginRequiredModal.openLoginRequiredModal();
      return;
    }
    router.push(getLoginRedirectPath());
  }, [loginRequiredModal, router]);

  const mutation = useMutation({
    mutationFn: (variables: BulkRemoveFavoriteVariables) =>
      variables.mode === "ids"
        ? removeFavoriteMoversBulk({ moverIds: variables.moverIds })
        : removeFavoriteMoversBulk({
            all: true,
            excludedIds: variables.excludedIds,
          }),
    onMutate: async (variables): Promise<BulkRemoveFavoriteContext> => {
      await queryClient.cancelQueries({ queryKey: favoriteMoversScopeQueryKey });

      const previousFavoriteMovers = queryClient.getQueriesData<FavoriteMoversCacheData>({
        queryKey: favoriteMoversScopeQueryKey,
      });

      if (variables.mode === "ids") {
        const idSet = new Set(variables.moverIds);
        queryClient.setQueriesData<FavoriteMoversCacheData>(
          { queryKey: favoriteMoversScopeQueryKey },
          (list) => removeIdsFromFavoriteMoversCache(list, idSet, variables.moverIds.length),
        );
      } else {
        const keepIds = new Set(variables.excludedIds);
        queryClient.setQueriesData<FavoriteMoversCacheData>(
          { queryKey: favoriteMoversScopeQueryKey },
          (list) => keepOnlyIdsInFavoriteMoversCache(list, keepIds, keepIds.size),
        );
      }

      return { previousFavoriteMovers };
    },
    onError: (error, _variables, context) => {
      context?.previousFavoriteMovers.forEach(([queryKey, data]) => {
        queryClient.setQueryData(queryKey, data);
      });

      if (isUnauthorizedError(error)) {
        requireLogin();
        return;
      }

      onErrorRef.current?.(getApiErrorMessage(error, ALL_FAILED_MESSAGE));
    },
    onSettled: () => {
      void invalidateFavoriteRelatedQueries(queryClient, authScope);
    },
  });

  const baseMutateAsync = mutation.mutateAsync;
  const mutateAsync = useCallback(
    (
      variables: BulkRemoveFavoriteVariables,
      mutateOptions?: Parameters<typeof baseMutateAsync>[1],
    ) => {
      if (auth.isPending) {
        return Promise.reject(new Error(LOGIN_REQUIRED_MESSAGE));
      }

      if (!auth.isAuthenticated || !hasAuthSession()) {
        requireLogin();
        return Promise.reject(new Error(LOGIN_REQUIRED_MESSAGE));
      }

      if (!isCustomer) {
        return Promise.reject(new Error(CUSTOMER_REQUIRED_MESSAGE));
      }

      if (variables.mode === "ids" && variables.moverIds.length === 0) {
        return Promise.resolve({ deletedCount: 0 });
      }

      return baseMutateAsync(variables, mutateOptions);
    },
    [auth.isAuthenticated, auth.isPending, baseMutateAsync, isCustomer, requireLogin],
  );

  return useMemo(() => ({ ...mutation, mutateAsync }), [mutation, mutateAsync]);
}
