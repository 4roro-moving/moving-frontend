"use client";

import { getAccessTokenPayload } from "@/lib/auth/accessTokenPayload";
import { getAccessToken } from "@/lib/auth/token";
import { AUTH_QUERY_UNRESOLVED_SCOPE, getAuthQueryScope } from "@/lib/constants/queryKeys";
import { useAuthStore } from "@/stores/useAuthStore";

/** 사용자 전용 React Query 캐시 scope와 사용자 식별 완료 여부를 반환합니다. */
export function useAuthQueryScope() {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const userId = useAuthStore((state) => state.user?.id);
  const tokenUserId = isAuthenticated ? getAccessTokenPayload(getAccessToken() ?? "").userId : null;

  const authScope = getAuthQueryScope(isAuthenticated, userId ?? tokenUserId);

  return {
    authScope,
    isAuthenticated,
    isAuthQueryReady: authScope !== AUTH_QUERY_UNRESOLVED_SCOPE,
  };
}
