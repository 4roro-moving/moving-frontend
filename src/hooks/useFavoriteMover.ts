"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { useEffect, useRef } from "react";

import { useLoginRequiredModal } from "@/components/auth/LoginRequiredModalProvider";
import { useAuthQueryScope } from "@/hooks/useAuthQueryScope";
import { useCustomerAuthReady } from "@/hooks/useCustomerAuthReady";
import { getApiErrorMessage } from "@/lib/api/getApiErrorMessage";
import { getLoginRedirectPath, hasAuthSession } from "@/lib/auth/session";
import {
  applyFavoriteOptimisticUpdate,
  invalidateFavoriteRelatedQueries,
  rollbackFavoriteOptimisticUpdate,
  type FavoriteMutationContext,
} from "@/lib/utils/favoriteMoverCache";
import {
  clearLatestFavoriteRequestId,
  createFavoriteRequestId,
  enqueueFavoriteRequest,
  isLatestFavoriteRequest,
  runFavoriteOptimisticQueue,
  setLatestFavoriteRequestId,
  StaleFavoriteRequestError,
} from "@/lib/utils/favoriteMoverQueue";
import { ApiError } from "@/types/api";
import { ERROR_CODES } from "@/lib/constants/errorCodes";

export { useBulkRemoveFavoriteMovers } from "@/hooks/useBulkRemoveFavoriteMovers";

const LOGIN_REQUIRED_MESSAGE = "로그인이 필요한 서비스입니다.";
const CUSTOMER_REQUIRED_MESSAGE = "고객만 이용할 수 있는 서비스입니다.";
const FAVORITE_SYNC_ERROR_MESSAGE = "찜 상태를 확인하지 못했습니다. 잠시 후 다시 확인해주세요.";

function isUnauthorizedError(error: unknown): boolean {
  if (error instanceof ApiError) {
    return (
      error.status === ERROR_CODES.UNAUTHORIZED.status ||
      error.code === ERROR_CODES.UNAUTHORIZED.code
    );
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

type AuthScope = ReturnType<typeof useAuthQueryScope>["authScope"];

interface FavoriteMoverRequest extends FavoriteMoverVariables {
  requestId: number;
  /** 요청을 큐에 넣은 시점의 세션 스코프. 실행 직전 현재 스코프와 비교해 계정 전환을 감지 */
  authScope: AuthScope;
  /** 실행 직전 현재 세션 스코프를 조회. ref 기반이라 큐 대기 중 값이 바뀌어도 최신값을 봄 */
  getCurrentAuthScope: () => AuthScope;
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

  /**
   * 마지막 찜 요청 이후 관련 캐시를 서버 상태와 재동기화합니다.
   * 찜 mutation 실패와 별개인 조회 실패이므로 추가 롤백 없이 사용자에게만 안내합니다.
   */
  const reconcileFavoriteQueries = async (requestAuthScope: AuthScope) => {
    try {
      await invalidateFavoriteRelatedQueries(queryClient, requestAuthScope, {
        throwOnError: true,
      });
    } catch {
      onErrorRef.current?.(FAVORITE_SYNC_ERROR_MESSAGE);
    }
  };

  const mutation = useMutation({
    mutationFn: (variables: FavoriteMoverRequest) => enqueueFavoriteRequest(variables),
    onMutate: async (variables): Promise<FavoriteMutationContext> => {
      const { moverId, nextIsFavorite, authScope: requestAuthScope } = variables;

      // 같은 기사님의 연속 낙관적 업데이트는 클릭 순서대로 처리합니다.
      return runFavoriteOptimisticQueue(requestAuthScope, moverId, () =>
        applyFavoriteOptimisticUpdate(queryClient, requestAuthScope, moverId, nextIsFavorite),
      );
    },
    onError: (error, variables, context) => {
      const isLatestRequest = isLatestFavoriteRequest(
        variables.authScope,
        variables.moverId,
        variables.requestId,
      );

      if (context && isLatestRequest) {
        rollbackFavoriteOptimisticUpdate(
          queryClient,
          variables.authScope,
          variables.moverId,
          context,
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
    onSettled: (_data, error, variables) => {
      if (!isLatestFavoriteRequest(variables.authScope, variables.moverId, variables.requestId)) {
        return;
      }

      clearLatestFavoriteRequestId(variables.authScope, variables.moverId);

      // 세션 변경으로 폐기됐거나 인증이 만료된 요청은 재동기화하지 않음
      if (error instanceof StaleFavoriteRequestError || isUnauthorizedError(error)) {
        return;
      }

      void reconcileFavoriteQueries(variables.authScope);
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

    const requestId = createFavoriteRequestId();
    setLatestFavoriteRequestId(authScope, variables.moverId, requestId);
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

    const requestId = createFavoriteRequestId();
    setLatestFavoriteRequestId(authScope, variables.moverId, requestId);
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
