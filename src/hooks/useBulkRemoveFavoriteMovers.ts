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
const ALL_FAILED_MESSAGE = "선택한 기사님을 삭제하지 못했습니다. 잠시 후 다시 시도해주세요.";

function isUnauthorizedError(error: unknown): boolean {
  if (error instanceof ApiError) {
    return error.status === 401 || error.code === "UNAUTHORIZED";
  }

  return false;
}

function buildPartialFailureMessage(totalCount: number, failedCount: number): string {
  return `${totalCount}명 중 ${failedCount}명의 찜을 해제하지 못했습니다. 잠시 후 다시 시도해주세요.`;
}

export interface BulkRemoveFavoriteResult {
  succeededIds: string[];
  failedIds: string[];
  /** 일부 요청이 401인 경우 — onSuccess에서 로그인 유도 (토스트와 중복되지 않게) */
  hadUnauthorizedError: boolean;
}

interface UseBulkRemoveFavoriteMoversOptions {
  onError?: (message: string) => void;
}

interface BulkRemoveFavoriteContext {
  previousFavoriteMovers: [readonly unknown[], FavoriteMoversCacheData | undefined][];
}

/** 찜한 기사님 여러 명 일괄 해제 — DELETE 병렬 + 부분 실패 구분 + 캐시 무효화 1회 */
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
    mutationFn: async (moverIds: string[]): Promise<BulkRemoveFavoriteResult> => {
      const results = await Promise.allSettled(
        moverIds.map(async (moverId) => {
          await removeFavoriteMover(moverId);
          return moverId;
        }),
      );

      const succeededIds: string[] = [];
      const failedIds: string[] = [];
      let unauthorizedError: unknown;
      let firstFailure: unknown;

      results.forEach((result, index) => {
        if (result.status === "fulfilled") {
          succeededIds.push(result.value);
          return;
        }

        failedIds.push(moverIds[index]);
        firstFailure ??= result.reason;
        if (!unauthorizedError && isUnauthorizedError(result.reason)) {
          unauthorizedError = result.reason;
        }
      });

      if (succeededIds.length === 0) {
        if (unauthorizedError) {
          throw unauthorizedError;
        }
        throw firstFailure instanceof Error
          ? firstFailure
          : new Error(getApiErrorMessage(firstFailure, ALL_FAILED_MESSAGE));
      }

      return {
        succeededIds,
        failedIds,
        hadUnauthorizedError: Boolean(unauthorizedError),
      };
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
    onSuccess: (result, moverIds, context) => {
      if (result.failedIds.length === 0) {
        return;
      }

      // 낙관적으로 전부 지웠던 캐시를 되돌린 뒤, 서버에서 실제 성공한 id만 다시 제거
      context?.previousFavoriteMovers.forEach(([queryKey, data]) => {
        queryClient.setQueryData(queryKey, data);
      });

      const succeededSet = new Set(result.succeededIds);
      queryClient.setQueriesData<FavoriteMoversCacheData>(
        { queryKey: QUERY_KEYS.FAVORITES.MOVERS },
        (list) =>
          removeIdsFromFavoriteMoversCache(list, succeededSet, result.succeededIds.length) as
            FavoriteMoversCacheData | undefined,
      );

      // 인증 만료가 섞인 부분 실패는 로그인 유도만 (부분 실패 토스트와 중복 방지)
      if (result.hadUnauthorizedError) {
        requireLogin();
        return;
      }

      onErrorRef.current?.(buildPartialFailureMessage(moverIds.length, result.failedIds.length));
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
    variables: string[],
    mutateOptions?: Parameters<typeof mutation.mutateAsync>[1],
  ) => {
    if (!hasAuthSession()) {
      requireLogin();
      return Promise.reject(new Error(LOGIN_REQUIRED_MESSAGE));
    }

    return mutation.mutateAsync(variables, mutateOptions);
  };

  return { ...mutation, mutateAsync };
}
