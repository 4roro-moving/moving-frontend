import {
  useInfiniteQuery,
  type InfiniteData,
  type QueryKey,
  type UseInfiniteQueryOptions,
  type UseInfiniteQueryResult,
} from "@tanstack/react-query";

// TError 타입을 ApiError 로 고정
import { ApiError } from "@/types/api";

import { defaultQueryRetry } from "@/lib/utils/queryDefaults";

/**
 * useInfiniteQuery의 공통 래퍼.
 *
 * @remarks
 * - TError는 `ApiError`로 고정되어 있습니다. queryFn은 반드시 `fetchInstance` 기반 함수여야 합니다.
 * - retry는 QueryProvider의 전역 기본값을 재정의합니다: 4xx는 재시도하지 않고, 그 외는 1회 재시도합니다.
 *   `options.retry`로 개별 재정의할 수 있습니다.
 *
 * @example
 * ```ts
 * useApiInfiniteQuery({
 *   queryKey: [...QUERY_KEYS.ESTIMATES.ALL, query],
 *   queryFn: ({ pageParam }) => getMoverEstimateRequests({ ...query, cursor: pageParam }),
 *   initialPageParam: undefined as string | undefined,
 *   getNextPageParam: (lastPage) => lastPage.pagination.nextCursor ?? undefined,
 * });
 * ```
 */
export const useApiInfiniteQuery = <
  TQueryFnData = unknown,
  TData = InfiniteData<TQueryFnData>,
  TQueryKey extends QueryKey = QueryKey,
  TPageParam = unknown,
>(
  options: UseInfiniteQueryOptions<TQueryFnData, ApiError, TData, TQueryKey, TPageParam>,
): UseInfiniteQueryResult<TData, ApiError> =>
  useInfiniteQuery({
    retry: defaultQueryRetry,
    ...options,
  });
