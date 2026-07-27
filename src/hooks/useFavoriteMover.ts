"use client";

import { useMutation, useQueryClient, type InfiniteData } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { useEffect, useRef } from "react";

import { addFavoriteMover, removeFavoriteMover } from "@/lib/api/favorites";
import { getApiErrorMessage } from "@/lib/api/getApiErrorMessage";
import { getLoginRedirectPath, hasAuthSession } from "@/lib/auth/session";
import { QUERY_KEYS } from "@/lib/constants/queryKeys";
import type {
  EstimateDetail,
  PendingEstimateSectionListResult,
  ReceivedEstimatePanel,
} from "@/types/estimate";
import type { MoversListResult } from "@/types/mover";

const LOGIN_REQUIRED_MESSAGE = "로그인이 필요한 서비스입니다.";

/** 토스트가 잠깐 보이도록 로그인 이동 전 대기 (ms) */
const LOGIN_REDIRECT_DELAY_MS = 600;

interface UseFavoriteMoverOptions {
  onError?: (message: string) => void;
}

interface FavoriteMoverVariables {
  moverId: string;
  /** 호출부가 원하는 최종 찜 상태 */
  nextIsFavorite: boolean;
}

interface FavoriteMutationContext {
  previousReceived: ReceivedEstimatePanel[] | undefined;
  previousDetails: [readonly unknown[], EstimateDetail | undefined][];
  previousPendingLists: [readonly unknown[], PendingEstimateSectionListResult | undefined][];
  previousPendingDetails: [readonly unknown[], EstimateDetail | undefined][];
  previousMoverLists: [readonly unknown[], InfiniteData<MoversListResult> | undefined][];
}

function patchMoverFavorite<T extends { id: string; isFavorite: boolean; favoriteCount: number }>(
  mover: T,
  moverId: string,
  nextIsFavorite: boolean,
): T {
  if (mover.id !== moverId) {
    return mover;
  }

  // 2026.07.27 정슬기 - [수정] 이미 목표 상태인 캐시는 count를 다시 증감하지 않음
  if (mover.isFavorite === nextIsFavorite) {
    return mover;
  }

  const delta = nextIsFavorite ? 1 : -1;

  return {
    ...mover,
    isFavorite: nextIsFavorite,
    favoriteCount: Math.max(0, mover.favoriteCount + delta),
  };
}

async function invalidateFavoriteRelatedQueries(
  queryClient: ReturnType<typeof useQueryClient>,
): Promise<void> {
  await Promise.all([
    queryClient.invalidateQueries({ queryKey: QUERY_KEYS.ESTIMATES.RECEIVED }),
    queryClient.invalidateQueries({ queryKey: QUERY_KEYS.ESTIMATES.DETAIL_ROOT }),
    queryClient.invalidateQueries({ queryKey: QUERY_KEYS.ESTIMATE_REQUESTS.MY_LIST }),
    queryClient.invalidateQueries({ queryKey: QUERY_KEYS.ESTIMATES.PENDING_DETAIL_ROOT }),
    queryClient.invalidateQueries({ queryKey: QUERY_KEYS.MOVERS.LIST }),
  ]);
}

// 2026.07.24 정슬기 - [추가] 찜 API 연동 후 받은 견적 목록·상세 캐시 갱신
// 2026.07.24 정슬기 - [수정] 낙관적 업데이트 롤백을 previous 캐시가 undefined여도 복원하도록 교정
// 2026.07.25 정슬기 - [수정] 비로그인 시 토스트 후 로그인 페이지 이동, API/낙관적 업데이트 미수행
// 2026.07.26 정슬기 - [수정] pending MY_LIST·PENDING_DETAIL 캐시도 동일하게 낙관적 갱신/무효화
// 2026.07.27 정슬기 - [수정] nextIsFavorite 전달·count 가드·onSettled invalidate
// 2026.07.27 - [수정] 기사님 찾기 목록(MOVERS.LIST)도 낙관적 갱신/무효화 (fetchInstance Bearer 정렬)
export function useFavoriteMover(options?: UseFavoriteMoverOptions) {
  const queryClient = useQueryClient();
  const router = useRouter();
  const onErrorRef = useRef(options?.onError);
  const redirectTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    onErrorRef.current = options?.onError;
  }, [options?.onError]);

  useEffect(() => {
    return () => {
      if (redirectTimeoutRef.current !== null) {
        clearTimeout(redirectTimeoutRef.current);
      }
    };
  }, []);

  const mutation = useMutation({
    mutationFn: async ({ moverId, nextIsFavorite }: FavoriteMoverVariables) => {
      if (nextIsFavorite) {
        return addFavoriteMover(moverId);
      }
      return removeFavoriteMover(moverId);
    },
    onMutate: async ({ moverId, nextIsFavorite }): Promise<FavoriteMutationContext> => {
      // 진행 중 refetch가 낙관적 패치를 덮어쓰지 않도록 관련 쿼리 취소
      await Promise.all([
        queryClient.cancelQueries({ queryKey: QUERY_KEYS.ESTIMATES.RECEIVED }),
        queryClient.cancelQueries({ queryKey: QUERY_KEYS.ESTIMATES.DETAIL_ROOT }),
        queryClient.cancelQueries({ queryKey: QUERY_KEYS.ESTIMATE_REQUESTS.MY_LIST }),
        queryClient.cancelQueries({ queryKey: QUERY_KEYS.ESTIMATES.PENDING_DETAIL_ROOT }),
        queryClient.cancelQueries({ queryKey: QUERY_KEYS.MOVERS.LIST }),
      ]);

      // 롤백용 스냅샷 (received + pending + movers list)
      const previousReceived = queryClient.getQueryData<ReceivedEstimatePanel[]>(
        QUERY_KEYS.ESTIMATES.RECEIVED,
      );
      const previousDetails = queryClient.getQueriesData<EstimateDetail>({
        queryKey: QUERY_KEYS.ESTIMATES.DETAIL_ROOT,
      });
      const previousPendingLists = queryClient.getQueriesData<PendingEstimateSectionListResult>({
        queryKey: QUERY_KEYS.ESTIMATE_REQUESTS.MY_LIST,
      });
      const previousPendingDetails = queryClient.getQueriesData<EstimateDetail>({
        queryKey: QUERY_KEYS.ESTIMATES.PENDING_DETAIL_ROOT,
      });
      const previousMoverLists = queryClient.getQueriesData<InfiniteData<MoversListResult>>({
        queryKey: QUERY_KEYS.MOVERS.LIST,
      });

      // 받은 견적 목록
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

      // 받은 견적 상세들
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

      // 대기 중 견적 목록 (query 파라미터가 붙어도 MY_LIST prefix로 매칭)
      queryClient.setQueriesData<PendingEstimateSectionListResult>(
        { queryKey: QUERY_KEYS.ESTIMATE_REQUESTS.MY_LIST },
        (list) => {
          if (!list) {
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

      // 대기 견적 상세들
      queryClient.setQueriesData<EstimateDetail>(
        { queryKey: QUERY_KEYS.ESTIMATES.PENDING_DETAIL_ROOT },
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

      // 기사님 찾기 목록 (infinite query pages)
      queryClient.setQueriesData<InfiniteData<MoversListResult>>(
        { queryKey: QUERY_KEYS.MOVERS.LIST },
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

      return {
        previousReceived,
        previousDetails,
        previousPendingLists,
        previousPendingDetails,
        previousMoverLists,
      };
    },
    onError: (error, _variables, context) => {
      // 실패 시 낙관적 패치 전부 롤백
      if (context) {
        queryClient.setQueryData(QUERY_KEYS.ESTIMATES.RECEIVED, context.previousReceived);
        context.previousDetails.forEach(([queryKey, data]) => {
          queryClient.setQueryData(queryKey, data);
        });
        context.previousPendingLists.forEach(([queryKey, data]) => {
          queryClient.setQueryData(queryKey, data);
        });
        context.previousPendingDetails.forEach(([queryKey, data]) => {
          queryClient.setQueryData(queryKey, data);
        });
        context.previousMoverLists.forEach(([queryKey, data]) => {
          queryClient.setQueryData(queryKey, data);
        });
      }

      onErrorRef.current?.(getApiErrorMessage(error));
    },
    // 성공·실패 모두 서버 상태와 최종 동기화 (응답 유실 시 롤백 캐시와 서버 불일치 방지)
    onSettled: async () => {
      await invalidateFavoriteRelatedQueries(queryClient);
    },
  });

  const redirectToLogin = () => {
    onErrorRef.current?.(LOGIN_REQUIRED_MESSAGE);

    if (redirectTimeoutRef.current !== null) {
      clearTimeout(redirectTimeoutRef.current);
    }

    redirectTimeoutRef.current = setTimeout(() => {
      redirectTimeoutRef.current = null;
      router.push(getLoginRedirectPath());
    }, LOGIN_REDIRECT_DELAY_MS);
  };

  const mutate: typeof mutation.mutate = (variables, mutateOptions) => {
    if (!hasAuthSession()) {
      redirectToLogin();
      return;
    }

    mutation.mutate(variables, mutateOptions);
  };

  const mutateAsync: typeof mutation.mutateAsync = (variables, mutateOptions) => {
    if (!hasAuthSession()) {
      redirectToLogin();
      return Promise.reject(new Error(LOGIN_REQUIRED_MESSAGE));
    }

    return mutation.mutateAsync(variables, mutateOptions);
  };

  return { ...mutation, mutate, mutateAsync };
}
