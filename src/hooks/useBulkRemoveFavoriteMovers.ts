"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { useEffect, useRef } from "react";

import { useLoginRequiredModal } from "@/components/auth/LoginRequiredModalProvider";
import { removeFavoriteMoversBulk } from "@/lib/api/favorites";
import { getApiErrorMessage } from "@/lib/api/getApiErrorMessage";
import { getLoginRedirectPath, hasAuthSession } from "@/lib/auth/session";
import { QUERY_KEYS } from "@/lib/constants/queryKeys";
import {
  invalidateFavoriteRelatedQueries,
  keepOnlyIdsInFavoriteMoversCache,
  removeIdsFromFavoriteMoversCache,
  type FavoriteMoversCacheData,
} from "@/lib/utils/favoriteMoverCache";
import { ApiError } from "@/types/api";

const LOGIN_REQUIRED_MESSAGE = "로그인이 필요한 서비스입니다.";
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
  const onErrorRef = useRef(options?.onError);

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

  const mutation = useMutation({
    mutationFn: (variables: BulkRemoveFavoriteVariables) =>
      variables.mode === "ids"
        ? removeFavoriteMoversBulk({ moverIds: variables.moverIds })
        : removeFavoriteMoversBulk({
            all: true,
            excludedIds: variables.excludedIds,
          }),
    onMutate: async (variables): Promise<BulkRemoveFavoriteContext> => {
      await queryClient.cancelQueries({ queryKey: QUERY_KEYS.FAVORITES.MOVERS });

      const previousFavoriteMovers = queryClient.getQueriesData<FavoriteMoversCacheData>({
        queryKey: QUERY_KEYS.FAVORITES.MOVERS,
      });

      if (variables.mode === "ids") {
        const idSet = new Set(variables.moverIds);
        queryClient.setQueriesData<FavoriteMoversCacheData>(
          { queryKey: QUERY_KEYS.FAVORITES.MOVERS },
          (list) =>
            removeIdsFromFavoriteMoversCache(list, idSet, variables.moverIds.length) as
              FavoriteMoversCacheData | undefined,
        );
      } else {
        const keepIds = new Set(variables.excludedIds);
        queryClient.setQueriesData<FavoriteMoversCacheData>(
          { queryKey: QUERY_KEYS.FAVORITES.MOVERS },
          (list) =>
            keepOnlyIdsInFavoriteMoversCache(list, keepIds, keepIds.size) as
              FavoriteMoversCacheData | undefined,
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
    onSettled: async () => {
      await invalidateFavoriteRelatedQueries(queryClient);
    },
  });

  const mutateAsync = (
    variables: BulkRemoveFavoriteVariables,
    mutateOptions?: Parameters<typeof mutation.mutateAsync>[1],
  ) => {
    if (!hasAuthSession()) {
      requireLogin();
      return Promise.reject(new Error(LOGIN_REQUIRED_MESSAGE));
    }

    if (variables.mode === "ids" && variables.moverIds.length === 0) {
      return Promise.resolve({ deletedCount: 0 });
    }

    return mutation.mutateAsync(variables, mutateOptions);
  };

  return { ...mutation, mutateAsync };
}
