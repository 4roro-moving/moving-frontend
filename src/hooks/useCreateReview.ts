"use client";

import { useQueryClient } from "@tanstack/react-query";

import { useApiMutation } from "@/hooks/queries/useApiMutation";
import { createReview } from "@/lib/api/reviews";
import { getApiErrorMessage } from "@/lib/api/getApiErrorMessage";
import { QUERY_KEYS } from "@/lib/constants/queryKeys";
import type { CreateReviewRequest } from "@/types/review";

interface UseCreateReviewOptions {
  /** 작성 대상 기사님 — 성공 시 해당 기사 리뷰·상세 캐시 무효화 */
  moverId?: string;
  onSuccess?: () => void;
  onError?: (message: string) => void;
}

/**
 * 리뷰 작성 mutation
 * // 2026.07.27 정슬기 - [추가]
 * // 2026.07.30 정슬기 - [수정] useApiMutation + ME_ROOT/REVIEWABLE/기사 리뷰·상세 invalidate
 */
export function useCreateReview(options: UseCreateReviewOptions = {}) {
  const queryClient = useQueryClient();

  return useApiMutation({
    mutationFn: (input: CreateReviewRequest) => createReview(input),
    onSuccess: async () => {
      const tasks = [
        queryClient.invalidateQueries({ queryKey: QUERY_KEYS.REVIEWS.ME_ROOT }),
        queryClient.invalidateQueries({ queryKey: QUERY_KEYS.REVIEWS.REVIEWABLE }),
      ];

      if (options.moverId) {
        tasks.push(
          queryClient.invalidateQueries({
            queryKey: QUERY_KEYS.REVIEWS.BY_MOVER_ROOT(options.moverId),
          }),
          queryClient.invalidateQueries({
            queryKey: QUERY_KEYS.MOVERS.DETAIL(options.moverId),
          }),
        );
      }

      await Promise.all(tasks);
      options.onSuccess?.();
    },
    onError: (error) => {
      options.onError?.(getApiErrorMessage(error, "리뷰 등록에 실패했습니다."));
    },
  });
}
