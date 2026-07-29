"use client";

import { useMutation, useQueryClient, type InfiniteData } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { useEffect, useRef } from "react";

import { useLoginRequiredModal } from "@/components/auth/LoginRequiredModalProvider";
import { addFavoriteMover, removeFavoriteMover } from "@/lib/api/favorites";
import { getApiErrorMessage } from "@/lib/api/getApiErrorMessage";
import { getLoginRedirectPath, hasAuthSession } from "@/lib/auth/session";
import { QUERY_KEYS } from "@/lib/constants/queryKeys";
import { ApiError } from "@/types/api";
import type {
  EstimateDetail,
  PendingEstimateSectionListResult,
  ReceivedEstimatePanel,
} from "@/types/estimate";
import type { MoversListResult } from "@/types/mover";
import type { MoverDetail } from "@/types/moverDetail";

const LOGIN_REQUIRED_MESSAGE = "로그인이 필요한 서비스입니다.";

function isUnauthorizedError(error: unknown): boolean {
  if (error instanceof ApiError) {
    return error.status === 401 || error.code === "UNAUTHORIZED";
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

interface FavoriteMutationContext {
  previousReceived: ReceivedEstimatePanel[] | undefined;
  previousDetails: [readonly unknown[], EstimateDetail | undefined][];
  previousPendingLists: [readonly unknown[], PendingEstimateSectionListResult | undefined][];
  previousPendingDetails: [readonly unknown[], EstimateDetail | undefined][];
  previousMoverLists: [readonly unknown[], InfiniteData<MoversListResult> | undefined][];
  previousFavoriteMovers: [readonly unknown[], MoversListResult | undefined][];
  previousMoverDetail: MoverDetail | undefined;
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
    queryClient.invalidateQueries({ queryKey: [...QUERY_KEYS.MOVERS.ALL, "detail"] }),
    queryClient.invalidateQueries({ queryKey: QUERY_KEYS.FAVORITES.MOVERS }),
  ]);
}

// 2026.07.24 정슬기 - [추가] 찜 API 연동 후 받은 견적 목록·상세 캐시 갱신
// 2026.07.24 정슬기 - [수정] 낙관적 업데이트 롤백을 previous 캐시가 undefined여도 복원하도록 교정
// 2026.07.25 정슬기 - [수정] 비로그인 시 로그인 유도 모달 (토스트·자동 이동 제거)
export function useFavoriteMover(options?: UseFavoriteMoverOptions) {
  const queryClient = useQueryClient();
  const router = useRouter();
  const loginRequiredModal = useLoginRequiredModal();
  const onErrorRef = useRef(options?.onError);

  useEffect(() => {
    onErrorRef.current = options?.onError;
  }, [options?.onError]);

  const requireLogin = () => {
    // 기사님 찾기 등 Provider가 있는 곳에서만 모달, 그 외는 로그인 페이지로 이동
    if (loginRequiredModal) {
      loginRequiredModal.openLoginRequiredModal();
      return;
    }
    router.push(getLoginRedirectPath());
  };

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
        queryClient.cancelQueries({ queryKey: QUERY_KEYS.MOVERS.DETAIL(moverId) }),
        queryClient.cancelQueries({ queryKey: QUERY_KEYS.FAVORITES.MOVERS }),
      ]);

      // 롤백용 스냅샷 (received + pending + movers list + mover detail + favorite movers)
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
      const previousFavoriteMovers = queryClient.getQueriesData<MoversListResult>({
        queryKey: QUERY_KEYS.FAVORITES.MOVERS,
      });
      const previousMoverDetail = queryClient.getQueryData<MoverDetail>(
        QUERY_KEYS.MOVERS.DETAIL(moverId),
      );

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

      // 찜한 기사님 사이드바: 해제 시 즉시 목록에서 제거 (등록은 onSettled invalidate로 동기화)
      if (!nextIsFavorite) {
        queryClient.setQueriesData<MoversListResult>(
          { queryKey: QUERY_KEYS.FAVORITES.MOVERS },
          (list) => {
            if (!list) {
              return list;
            }

            const data = list.data.filter((mover) => mover.id !== moverId);
            if (data.length === list.data.length) {
              return list;
            }

            return {
              ...list,
              data,
              pagination: {
                ...list.pagination,
                totalCount: Math.max(0, list.pagination.totalCount - 1),
              },
            };
          },
        );
      }

      // 기사님 상세
      queryClient.setQueryData<MoverDetail>(QUERY_KEYS.MOVERS.DETAIL(moverId), (detail) => {
        if (!detail) {
          return detail;
        }

        return patchMoverFavorite(detail, moverId, nextIsFavorite);
      });

      return {
        previousReceived,
        previousDetails,
        previousPendingLists,
        previousPendingDetails,
        previousMoverLists,
        previousFavoriteMovers,
        previousMoverDetail,
      };
    },
    onError: (error, variables, context) => {
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
        context.previousFavoriteMovers.forEach(([queryKey, data]) => {
          queryClient.setQueryData(queryKey, data);
        });
        queryClient.setQueryData(
          QUERY_KEYS.MOVERS.DETAIL(variables.moverId),
          context.previousMoverDetail,
        );
      }

      // Access만 있고 refresh 쿠키가 없는 잔여 세션 → 로그인 유도 (토큰 없음 메시지 대신)
      if (isUnauthorizedError(error)) {
        requireLogin();
        return;
      }

      onErrorRef.current?.(getApiErrorMessage(error));
    },
    // 성공·실패 모두 서버 상태와 최종 동기화 (응답 유실 시 롤백 캐시와 서버 불일치 방지)
    onSettled: async () => {
      await invalidateFavoriteRelatedQueries(queryClient);
    },
  });

  const mutate: typeof mutation.mutate = (variables, mutateOptions) => {
    if (!hasAuthSession()) {
      requireLogin();
      return;
    }

    mutation.mutate(variables, mutateOptions);
  };

  const mutateAsync: typeof mutation.mutateAsync = (variables, mutateOptions) => {
    if (!hasAuthSession()) {
      requireLogin();
      return Promise.reject(new Error(LOGIN_REQUIRED_MESSAGE));
    }

    return mutation.mutateAsync(variables, mutateOptions);
  };

  return { ...mutation, mutate, mutateAsync };
}
