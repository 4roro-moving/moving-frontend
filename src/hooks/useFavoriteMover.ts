"use client";

import { useMutation, useQueryClient, type InfiniteData } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { useEffect, useRef } from "react";

import { useLoginRequiredModal } from "@/components/auth/LoginRequiredModalProvider";
import { useAuthQueryScope } from "@/hooks/useAuthQueryScope";
import { useCustomerAuthReady } from "@/hooks/useCustomerAuthReady";
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
const CUSTOMER_REQUIRED_MESSAGE = "고객만 이용할 수 있는 서비스입니다.";

/** 세션(authScope)이 바뀐 뒤 뒤늦게 실행되려는 요청을 조용히 폐기하기 위한 sentinel 에러 */
class StaleFavoriteRequestError extends Error {
  constructor() {
    super("찜 요청이 실행되기 전에 세션이 변경되어 폐기되었습니다.");
    this.name = "StaleFavoriteRequestError";
  }
}

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

interface FavoriteMoverRequest extends FavoriteMoverVariables {
  requestId: number;
  /** 요청을 큐에 넣은 시점의 세션 스코프. 실행 직전 현재 스코프와 비교해 계정 전환을 감지 */
  authScope: string;
  /** 실행 직전 현재 세션 스코프를 조회. ref 기반이라 큐 대기 중 값이 바뀌어도 최신값을 봄 */
  getCurrentAuthScope: () => string;
}

interface FavoriteMutationContext {
  previousReceived: ReceivedEstimatePanel[] | undefined;
  previousDetails: [readonly unknown[], EstimateDetail | undefined][];
  previousPendingLists: [readonly unknown[], PendingEstimateSectionListResult | undefined][];
  previousMoverLists: [readonly unknown[], InfiniteData<MoversListResult> | undefined][];
  previousFavoriteMovers: [readonly unknown[], FavoriteMoversCacheData | undefined][];
  previousMoverDetail: MoverDetail | undefined;
}

const favoriteRequestQueues = new Map<string, Promise<unknown>>();
const favoriteOptimisticQueues = new Map<string, Promise<unknown>>();
const latestFavoriteRequestIds = new Map<string, number>();
let favoriteRequestId = 0;

/** moverId만으로는 계정 전환 시 큐가 세션을 넘나들며 공유되므로 authScope까지 키에 포함 */
function getFavoriteQueueKey(authScope: string, moverId: string) {
  return `${authScope}:${moverId}`;
}

/**
 * 주어진 key에 대해 task들을 등록된 순서대로 순차 실행합니다.
 * task 자체는 동기 시점(호출 즉시)에 큐에 등록되므로, 실제 완료 순서가 뒤바뀌어도 시작 순서는 항상 호출 순서를 따릅니다.
 */
function runSerialized<T>(
  queues: Map<string, Promise<unknown>>,
  key: string,
  task: () => Promise<T>,
): Promise<T> {
  const previous = queues.get(key) ?? Promise.resolve();
  const run = previous.catch(() => undefined).then(task);
  const tail = run.then(
    () => undefined,
    () => undefined,
  );

  queues.set(key, tail);
  void tail.finally(() => {
    if (queues.get(key) === tail) {
      queues.delete(key);
    }
  });

  return run;
}

/**
 * 같은 기사님의 연속 찜 요청은 클릭 순서대로 서버에 전달합니다.
 * 큐 대기 중 로그아웃/계정 전환이 일어나면, 실행 직전 세션이 달라졌는지 확인해 다른 계정의 토큰으로 이전 계정의 요청이 실행되지 않도록 폐기합니다.
 */
function enqueueFavoriteRequest({
  moverId,
  nextIsFavorite,
  authScope,
  getCurrentAuthScope,
}: FavoriteMoverRequest) {
  const queueKey = getFavoriteQueueKey(authScope, moverId);

  return runSerialized(favoriteRequestQueues, queueKey, async () => {
    if (getCurrentAuthScope() !== authScope) {
      throw new StaleFavoriteRequestError();
    }

    return nextIsFavorite ? addFavoriteMover(moverId) : removeFavoriteMover(moverId);
  });
}

/** 기사님 단건 찜 추가/해제 + 관련 목록·상세 낙관적 업데이트 */
export function useFavoriteMover(options?: UseFavoriteMoverOptions) {
  const queryClient = useQueryClient();
  const router = useRouter();
  const loginRequiredModal = useLoginRequiredModal();
  const auth = useCustomerAuthReady();
  const isCustomer = auth.user?.role === "CUSTOMER";
  const canToggleFavorite = !auth.isPending && (!auth.isAuthenticated || isCustomer);
  const { authScope } = useAuthQueryScope();
  const moverListScopeQueryKey = getMoverListScopeQueryKey(authScope);
  const favoriteMoversScopeQueryKey = getFavoriteMoversScopeQueryKey(authScope);
  const onErrorRef = useRef(options?.onError);
  // 큐에 대기 중인 요청이 실행되는 시점에 현재 세션을 조회하기 위한 ref
  // authScope를 클로저로 그대로 캡처하면 대기 중 값이 바뀌어도 갱신되지 않음
  const authScopeRef = useRef(authScope);

  useEffect(() => {
    onErrorRef.current = options?.onError;
  }, [options?.onError]);

  useEffect(() => {
    authScopeRef.current = authScope;
  }, [authScope]);

  const requireLogin = () => {
    if (loginRequiredModal) {
      loginRequiredModal.openLoginRequiredModal();
      return;
    }
    router.push(getLoginRedirectPath());
  };

  const mutation = useMutation({
    mutationFn: enqueueFavoriteRequest,
    onMutate: async (variables): Promise<FavoriteMutationContext> => {
      const { moverId, nextIsFavorite, authScope: requestAuthScope } = variables;
      const queueKey = getFavoriteQueueKey(requestAuthScope, moverId);

      // cancelQueries~setQueryData(낙관적 업데이트) 구간을 클릭 순서대로 강제
      // 큐에 등록하는 시점은 항상 동기적으로 클릭 순서를 따르므로, 실제 cancelQueries 완료 순서가 뒤바뀌어도 마지막 클릭 상태가 최종적으로 반영됨
      return runSerialized(favoriteOptimisticQueues, queueKey, async () => {
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

        queryClient.setQueryData<ReceivedEstimatePanel[]>(
          QUERY_KEYS.ESTIMATES.RECEIVED,
          (panels) => {
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
          },
        );

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
            (list) => removeIdsFromFavoriteMoversCache(list, new Set([moverId]), 1),
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
      });
    },
    onError: (error, variables, context) => {
      const isLatestRequest =
        latestFavoriteRequestIds.get(variables.moverId) === variables.requestId;

      if (context && isLatestRequest) {
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

      // 세션 전환으로 폐기된 요청은 실제 실패가 아니므로 에러 처리하지 않음
      if (error instanceof StaleFavoriteRequestError) {
        return;
      }

      if (isUnauthorizedError(error)) {
        if (isLatestRequest) {
          requireLogin();
        }
        return;
      }

      if (isLatestRequest) {
        onErrorRef.current?.(getApiErrorMessage(error));
      }
    },
    onSettled: (_data, _error, variables) => {
      if (latestFavoriteRequestIds.get(variables.moverId) !== variables.requestId) {
        return;
      }

      latestFavoriteRequestIds.delete(variables.moverId);
      void invalidateFavoriteRelatedQueries(queryClient, authScope);
    },
  });

  const mutate = (
    variables: FavoriteMoverVariables,
    mutateOptions?: Parameters<typeof mutation.mutate>[1],
  ) => {
    if (auth.isPending) {
      return;
    }

    if (!auth.isAuthenticated || !hasAuthSession()) {
      requireLogin();
      return;
    }

    if (!isCustomer) {
      return;
    }

    const requestId = ++favoriteRequestId;
    latestFavoriteRequestIds.set(variables.moverId, requestId);
    mutation.mutate(
      {
        ...variables,
        requestId,
        authScope,
        getCurrentAuthScope: () => authScopeRef.current,
      },
      mutateOptions,
    );
  };

  const mutateAsync = (
    variables: FavoriteMoverVariables,
    mutateOptions?: Parameters<typeof mutation.mutateAsync>[1],
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

    const requestId = ++favoriteRequestId;
    latestFavoriteRequestIds.set(variables.moverId, requestId);
    return mutation.mutateAsync(
      {
        ...variables,
        requestId,
        authScope,
        getCurrentAuthScope: () => authScopeRef.current,
      },
      mutateOptions,
    );
  };

  return { ...mutation, canToggleFavorite, mutate, mutateAsync };
}
