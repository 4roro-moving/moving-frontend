"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";

import { createReview } from "@/lib/api/reviews";
import { getApiErrorMessage } from "@/lib/api/getApiErrorMessage";
import { QUERY_KEYS } from "@/lib/constants/queryKeys";
import type { CreateReviewInput } from "@/types/review";

interface UseCreateReviewOptions {
  onSuccess?: () => void;
  onError?: (message: string) => void;
}

// 2026.07.27 정슬기 - [추가] 리뷰 작성 mutation + ME/REVIEWABLE invalidate
export function useCreateReview(options: UseCreateReviewOptions = {}) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (input: CreateReviewInput) => createReview(input),
    onSuccess: async () => {
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: QUERY_KEYS.REVIEWS.ME }),
        queryClient.invalidateQueries({ queryKey: QUERY_KEYS.REVIEWS.REVIEWABLE }),
      ]);
      options.onSuccess?.();
    },
    onError: (error) => {
      options.onError?.(getApiErrorMessage(error, "리뷰 등록에 실패했습니다."));
    },
  });
}
