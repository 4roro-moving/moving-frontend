"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";

import { addFavoriteMover, removeFavoriteMover } from "@/lib/api/favorites";
import { getApiErrorMessage } from "@/lib/api/getApiErrorMessage";
import { QUERY_KEYS } from "@/lib/constants/queryKeys";
import type { EstimateDetail, EstimateMoverSummary, ReceivedEstimatePanel } from "@/types/estimate";

interface UseFavoriteMoverOptions {
  onError?: (message: string) => void;
}

function patchMoverFavorite<T extends EstimateMoverSummary>(
  mover: T,
  moverId: string,
  nextIsFavorite: boolean,
): T {
  if (mover.id !== moverId) {
    return mover;
  }

  const delta = nextIsFavorite ? 1 : -1;

  return {
    ...mover,
    isFavorite: nextIsFavorite,
    favoriteCount: Math.max(0, mover.favoriteCount + delta),
  };
}

// 2026.07.24 정슬기 - [추가] 찜 API 연동 후 받은 견적 목록·상세 캐시 갱신
// 2026.07.24 정슬기 - [수정] 낙관적 업데이트 롤백을 previous 캐시가 undefined여도 복원하도록 교정
export function useFavoriteMover(options?: UseFavoriteMoverOptions) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ moverId, isFavorite }: { moverId: string; isFavorite: boolean }) => {
      if (isFavorite) {
        return removeFavoriteMover(moverId);
      }
      return addFavoriteMover(moverId);
    },
    onMutate: async ({ moverId, isFavorite }) => {
      const nextIsFavorite = !isFavorite;

      await Promise.all([
        queryClient.cancelQueries({ queryKey: QUERY_KEYS.ESTIMATES.RECEIVED }),
        queryClient.cancelQueries({ queryKey: QUERY_KEYS.ESTIMATES.DETAIL_ROOT }),
      ]);

      const previousReceived = queryClient.getQueryData<ReceivedEstimatePanel[]>(
        QUERY_KEYS.ESTIMATES.RECEIVED,
      );
      const previousDetails = queryClient.getQueriesData<EstimateDetail>({
        queryKey: QUERY_KEYS.ESTIMATES.DETAIL_ROOT,
      });

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
          if (!detail) {
            return detail;
          }

          return {
            ...detail,
            mover: patchMoverFavorite(detail.mover, moverId, nextIsFavorite),
          };
        },
      );

      return { previousReceived, previousDetails };
    },
    onError: (error, _variables, context) => {
      if (context) {
        queryClient.setQueryData(QUERY_KEYS.ESTIMATES.RECEIVED, context.previousReceived);
        context.previousDetails.forEach(([queryKey, data]) => {
          queryClient.setQueryData(queryKey, data);
        });
      }

      options?.onError?.(getApiErrorMessage(error));
    },
    onSuccess: async () => {
      // 2026.07.24 정슬기 - [수정] 찜 API는 estimateId가 없으므로 상세 키 invalidate로 동기화
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: QUERY_KEYS.ESTIMATES.RECEIVED }),
        queryClient.invalidateQueries({ queryKey: QUERY_KEYS.ESTIMATES.DETAIL_ROOT }),
      ]);
    },
  });
}
