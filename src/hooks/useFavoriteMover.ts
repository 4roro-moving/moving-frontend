"use client";

import { useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { useEffect, useRef } from "react";

import { useLoginRequiredModal } from "@/components/auth/LoginRequiredModalProvider";
import { useAuthQueryScope } from "@/hooks/useAuthQueryScope";
import { useCustomerAuthReady } from "@/hooks/useCustomerAuthReady";
import { getLoginRedirectPath, hasAuthSession } from "@/lib/auth/session";
import { syncFavoriteMover } from "@/lib/utils/favoriteMoverCoordinator";

export { useBulkRemoveFavoriteMovers } from "@/hooks/useBulkRemoveFavoriteMovers";

const LOGIN_REQUIRED_MESSAGE = "로그인이 필요한 서비스입니다.";
const CUSTOMER_REQUIRED_MESSAGE = "고객만 이용할 수 있는 서비스입니다.";

interface FavoriteMoverVariables {
  moverId: string;
  nextIsFavorite: boolean;
}

interface UseFavoriteMoverOptions {
  onError?: (message: string) => void;
}

/** 마지막 사용자 의도만 서버 상태로 수렴시키는 단건 찜 mutation */
export function useFavoriteMover(options?: UseFavoriteMoverOptions) {
  const queryClient = useQueryClient();
  const router = useRouter();
  const loginRequiredModal = useLoginRequiredModal();
  const auth = useCustomerAuthReady();
  const { authScope, isAuthQueryReady } = useAuthQueryScope();
  const authScopeRef = useRef(authScope);
  const onErrorRef = useRef(options?.onError);
  const isCustomer = auth.user?.role === "CUSTOMER";
  const canToggleFavorite =
    isAuthQueryReady && !auth.isPending && (!auth.isAuthenticated || isCustomer);

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

  const mutate = ({ moverId, nextIsFavorite }: FavoriteMoverVariables) => {
    if (auth.isPending || !isAuthQueryReady) return;
    if (!auth.isAuthenticated || !hasAuthSession()) {
      requireLogin();
      return;
    }
    if (!isCustomer) return;

    syncFavoriteMover({
      authScope,
      moverId,
      nextIsFavorite,
      queryClient,
      isAuthScopeCurrent: () => authScopeRef.current === authScope,
      onUnauthorized: requireLogin,
      onError: (message) => {
        onErrorRef.current?.(message);
      },
    });
  };

  const mutateAsync = (variables: FavoriteMoverVariables) => {
    if (auth.isPending || !isAuthQueryReady) {
      return Promise.reject(new Error(LOGIN_REQUIRED_MESSAGE));
    }
    if (!auth.isAuthenticated || !hasAuthSession()) {
      requireLogin();
      return Promise.reject(new Error(LOGIN_REQUIRED_MESSAGE));
    }
    if (!isCustomer) return Promise.reject(new Error(CUSTOMER_REQUIRED_MESSAGE));
    mutate(variables);
    return Promise.resolve();
  };

  return { canToggleFavorite, mutate, mutateAsync };
}
