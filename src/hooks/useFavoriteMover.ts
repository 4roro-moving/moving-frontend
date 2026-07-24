"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";

import { addFavoriteMover, removeFavoriteMover } from "@/lib/api/favorites";
import { getApiErrorMessage } from "@/lib/api/getApiErrorMessage";
import { QUERY_KEYS } from "@/lib/constants/queryKeys";
import type { EstimateDetail, EstimateMoverSummary, ReceivedEstimatePanel } from "@/types/estimate";

interface UseFavoriteMoverOptions {
  onError?: (message: string) => void;
}

function patchMoverFavorite(
  mover: EstimateMoverSummary,
  moverId: string,
  nextIsFavorite: boolean,
): EstimateMoverSummary {
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
// 2026.07.24 정슬기 - [수정] 클릭 직후 하트 채움이 보이도록 낙관적 업데이트 적용
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
        queryClient.cancelQueries({ queryKey: ["estimates", "detail"] }),
      ]);

      const previousReceived = queryClient.getQueryData<ReceivedEstimatePanel[]>(
        QUERY_KEYS.ESTIMATES.RECEIVED,
      );
      const previousDetails = queryClient.getQueriesData<EstimateDetail>({
        queryKey: ["estimates", "detail"],
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
        { queryKey: ["estimates", "detail"] },
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
      if (context?.previousReceived) {
        queryClient.setQueryData(QUERY_KEYS.ESTIMATES.RECEIVED, context.previousReceived);
      }

      context?.previousDetails.forEach(([queryKey, data]) => {
        queryClient.setQueryData(queryKey, data);
      });

      options?.onError?.(getApiErrorMessage(error));
    },
    onSettled: async () => {
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: QUERY_KEYS.ESTIMATES.RECEIVED }),
        queryClient.invalidateQueries({ queryKey: ["estimates", "detail"] }),
      ]);
    },
  });
}
