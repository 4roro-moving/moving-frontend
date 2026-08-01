"use client";

import { useMutation, useQueryClient, type InfiniteData } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { useEffect, useRef } from "react";

import { useLoginRequiredModal } from "@/components/auth/LoginRequiredModalProvider";
import { useAuthQueryScope } from "@/hooks/useAuthQueryScope";
import { addFavoriteMover, removeFavoriteMover } from "@/lib/api/favorites";
import { getApiErrorMessage } from "@/lib/api/getApiErrorMessage";
import { getLoginRedirectPath, hasAuthSession } from "@/lib/auth/session";
import {
  getFavoriteMoversScopeQueryKey,
  getMoverDetailQueryKey,
  getMoverListScopeQueryKey,
  QUERY_KEYS,
} from "@/lib/constants/queryKeys";
import {
  invalidateFavoriteRelatedQueries,
  patchMoverFavorite,
  removeIdsFromFavoriteMoversCache,
  type FavoriteMoversCacheData,
} from "@/lib/utils/favoriteMoverCache";
import { ApiError } from "@/types/api";
import type {
  EstimateDetail,
  PendingEstimateSectionListResult,
  ReceivedEstimatePanel,
} from "@/types/estimate";
import type { MoversListResult } from "@/types/mover";
import type { MoverDetail } from "@/types/moverDetail";

export { useBulkRemoveFavoriteMovers } from "@/hooks/useBulkRemoveFavoriteMovers";

const LOGIN_REQUIRED_MESSAGE = "로그인이 필요한 서비스입니다.";

function isUnauthorizedError(error: unknown): boolean {
  if (error instanceof ApiError) {
    return error.status === 401 || error.code === "UNAUTHORIZED";
  }

  return false;
}

interface UseFavoriteMoverOptions {
  onError?: (message: string) => void;
}

interface FavoriteMoverVariables {
  moverId: string;
  /** 호출부가 원하는 최종 찜 상태 */
  nextIsFavorite: boolean;
}

interface FavoriteMutationContext {
  previousReceived: ReceivedEstimatePanel[] | undefined;
  previousDetails: [readonly unknown[], EstimateDetail | undefined][];
  previousPendingLists: [readonly unknown[], PendingEstimateSectionListResult | undefined][];
  previousMoverLists: [readonly unknown[], InfiniteData<MoversListResult> | undefined][];
  previousFavoriteMovers: [readonly unknown[], FavoriteMoversCacheData | undefined][];
  previousMoverDetail: MoverDetail | undefined;
}

/** 기사님 단건 찜 추가/해제 + 관련 목록·상세 낙관적 업데이트 */
export function useFavoriteMover(options?: UseFavoriteMoverOptions) {
  const queryClient = useQueryClient();
  const router = useRouter();
  const loginRequiredModal = useLoginRequiredModal();
  const { authScope } = useAuthQueryScope();
  const moverListScopeQueryKey = getMoverListScopeQueryKey(authScope);
  const favoriteMoversScopeQueryKey = getFavoriteMoversScopeQueryKey(authScope);
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
    mutationFn: async ({ moverId, nextIsFavorite }: FavoriteMoverVariables) => {
      if (nextIsFavorite) {
        return addFavoriteMover(moverId);
      }
      return removeFavoriteMover(moverId);
    },
    onMutate: async ({ moverId, nextIsFavorite }): Promise<FavoriteMutationContext> => {
      const moverDetailQueryKey = getMoverDetailQueryKey(authScope, moverId);

      await Promise.all([
        queryClient.cancelQueries({ queryKey: QUERY_KEYS.ESTIMATES.RECEIVED }),
        queryClient.cancelQueries({ queryKey: QUERY_KEYS.ESTIMATES.DETAIL_ROOT }),
        queryClient.cancelQueries({ queryKey: QUERY_KEYS.ESTIMATES.PENDING_LIST_ROOT }),
        queryClient.cancelQueries({ queryKey: moverListScopeQueryKey }),
        queryClient.cancelQueries({ queryKey: moverDetailQueryKey }),
        queryClient.cancelQueries({ queryKey: favoriteMoversScopeQueryKey }),
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
        { queryKey: QUERY_KEYS.ESTIMATES.DETAIL_ROOT },
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
                mover: patchMoverFavorite(estimate.mover, moverId, nextIsFavorite),
              })),
            })),
          };
        },
      );

      queryClient.setQueriesData<InfiniteData<MoversListResult>>(
        { queryKey: moverListScopeQueryKey },
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
          { queryKey: favoriteMoversScopeQueryKey },
          (list) =>
            removeIdsFromFavoriteMoversCache(list, new Set([moverId]), 1) as
              FavoriteMoversCacheData | undefined,
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
    },
    onError: (error, variables, context) => {
      if (context) {
        queryClient.setQueryData(QUERY_KEYS.ESTIMATES.RECEIVED, context.previousReceived);
        context.previousDetails.forEach(([queryKey, data]) => {
          queryClient.setQueryData(queryKey, data);
        });
        context.previousPendingLists.forEach(([queryKey, data]) => {
          queryClient.setQueryData(queryKey, data);
        });
        context.previousMoverLists.forEach(([queryKey, data]) => {
          queryClient.setQueryData(queryKey, data);
        });
        context.previousFavoriteMovers.forEach(([queryKey, data]) => {
          queryClient.setQueryData(queryKey, data);
        });
        queryClient.setQueryData(
          getMoverDetailQueryKey(authScope, variables.moverId),
          context.previousMoverDetail,
        );
      }

      if (isUnauthorizedError(error)) {
        requireLogin();
        return;
      }

      onErrorRef.current?.(getApiErrorMessage(error));
    },
    onSettled: async () => {
      await invalidateFavoriteRelatedQueries(queryClient, authScope);
    },
  });

  const mutate: typeof mutation.mutate = (variables, mutateOptions) => {
    if (!hasAuthSession()) {
      requireLogin();
      return;
    }

    mutation.mutate(variables, mutateOptions);
  };

  const mutateAsync: typeof mutation.mutateAsync = (variables, mutateOptions) => {
    if (!hasAuthSession()) {
      requireLogin();
      return Promise.reject(new Error(LOGIN_REQUIRED_MESSAGE));
    }

    return mutation.mutateAsync(variables, mutateOptions);
  };

  return { ...mutation, mutate, mutateAsync };
}
