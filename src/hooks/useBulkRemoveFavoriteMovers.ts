"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { useEffect, useRef } from "react";

import { useLoginRequiredModal } from "@/components/auth/LoginRequiredModalProvider";
import { removeFavoriteMover } from "@/lib/api/favorites";
import { getApiErrorMessage } from "@/lib/api/getApiErrorMessage";
import { getLoginRedirectPath, hasAuthSession } from "@/lib/auth/session";
import { QUERY_KEYS } from "@/lib/constants/queryKeys";
import {
  invalidateFavoriteRelatedQueries,
  removeIdsFromFavoriteMoversCache,
  type FavoriteMoversCacheData,
} from "@/lib/utils/favoriteMoverCache";
import { ApiError } from "@/types/api";

const LOGIN_REQUIRED_MESSAGE = "로그인이 필요한 서비스입니다.";

function isUnauthorizedError(error: unknown): boolean {
  if (error instanceof ApiError) {
    return error.status === 401 || error.code === "UNAUTHORIZED";
  }

  return false;
}

interface UseBulkRemoveFavoriteMoversOptions {
  onError?: (message: string) => void;
}

interface BulkRemoveFavoriteContext {
  previousFavoriteMovers: [readonly unknown[], FavoriteMoversCacheData | undefined][];
}

/** 찜한 기사님 여러 명 일괄 해제 — DELETE 병렬 + 캐시 무효화 1회 */
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
    mutationFn: async (moverIds: string[]) => {
      await Promise.all(moverIds.map((moverId) => removeFavoriteMover(moverId)));
    },
    onMutate: async (moverIds): Promise<BulkRemoveFavoriteContext> => {
      await queryClient.cancelQueries({ queryKey: QUERY_KEYS.FAVORITES.MOVERS });

      const previousFavoriteMovers = queryClient.getQueriesData<FavoriteMoversCacheData>({
        queryKey: QUERY_KEYS.FAVORITES.MOVERS,
      });
      const idSet = new Set(moverIds);

      queryClient.setQueriesData<FavoriteMoversCacheData>(
        { queryKey: QUERY_KEYS.FAVORITES.MOVERS },
        (list) =>
          removeIdsFromFavoriteMoversCache(list, idSet, moverIds.length) as
            FavoriteMoversCacheData | undefined,
      );

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

      onErrorRef.current?.(getApiErrorMessage(error));
    },
    onSettled: async () => {
      await invalidateFavoriteRelatedQueries(queryClient);
    },
  });

  const mutateAsync: typeof mutation.mutateAsync = (variables, mutateOptions) => {
    if (!hasAuthSession()) {
      requireLogin();
      return Promise.reject(new Error(LOGIN_REQUIRED_MESSAGE));
    }

    return mutation.mutateAsync(variables, mutateOptions);
  };

  return { ...mutation, mutateAsync };
}
