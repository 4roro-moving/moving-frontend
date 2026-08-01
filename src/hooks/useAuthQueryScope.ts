"use client";

import { getAccessTokenPayload } from "@/lib/auth/accessTokenPayload";
import { getAccessToken } from "@/lib/auth/token";
import { getAuthQueryScope } from "@/lib/constants/queryKeys";
import { useAuthStore } from "@/stores/useAuthStore";

/** 사용자 전용 React Query 캐시를 분리할 세션 scope를 반환합니다. */
export function useAuthQueryScope() {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const userId = useAuthStore((state) => state.user?.id);
  const tokenUserId = isAuthenticated ? getAccessTokenPayload(getAccessToken() ?? "").userId : null;

  return getAuthQueryScope(userId ?? tokenUserId);
}
