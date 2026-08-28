"use client";

import { useQuery } from "@tanstack/react-query";

import { useAuthQueryScope } from "@/hooks/useAuthQueryScope";
import { getMoverDetail } from "@/lib/api/movers";
import { getMoverDetailQueryKey } from "@/lib/constants/queryKeys";
import { isMoverDetailId } from "@/lib/utils/isMoverDetailId";
import { mapMoverDetailItemToMoverDetail } from "@/lib/utils/mapMover";
import { useAuthStore } from "@/stores/useAuthStore";
import { ApiError } from "@/types/api";

function isMoverNotFoundError(error: unknown): boolean {
  return error instanceof ApiError && (error.status === 404 || error.code === "MOVER_NOT_FOUND");
}

export function useMoverDetail(moverId: string) {
  const hasHydrated = useAuthStore((state) => state.hasHydrated);
  const isCheckingAuth = useAuthStore((state) => state.isCheckingAuth);
  const { authScope, isAuthQueryReady: hasResolvedAuthScope } = useAuthQueryScope();

  const isSessionCheckComplete = hasHydrated && !isCheckingAuth;

  const query = useQuery({
    queryKey: getMoverDetailQueryKey(authScope, moverId),
    queryFn: async () => {
      const item = await getMoverDetail(moverId);
      return mapMoverDetailItemToMoverDetail(item);
    },
    // optional API의 guest 응답이 로그인 캐시에 저장되지 않도록 인증 상태 확정 후 조회
    enabled: isSessionCheckComplete && hasResolvedAuthScope && isMoverDetailId(moverId),
  });

  const isInitialLoading = !isSessionCheckComplete || !hasResolvedAuthScope || query.isPending;

  return {
    detail: query.data,
    isInitialLoading,
    isNotFound: isMoverNotFoundError(query.error),
    query,
  };
}
