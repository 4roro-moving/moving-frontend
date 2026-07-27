import {
  useQuery,
  type QueryKey,
  type UseQueryOptions,
  type UseQueryResult,
} from "@tanstack/react-query";

// TError 타입을 ApiError 로 고정
import { ApiError } from "@/types/api";

// query retry default 설정
import { defaultQueryRetry } from "@/lib/utils/queryDefaults";

/**
 * useQuery의 공통 래퍼.
 *
 * @remarks
 * - **TError는 `ApiError`로 고정되어 있습니다.** 이 타입이 실제로 보장되려면
 *   `queryFn`은 반드시 `fetchInstance`(`@/lib/api/fetchInstance`) 기반의 API 함수만 사용해야 합니다.
 *   다른 방식으로 예외를 던지면 선언된 타입과 런타임 객체가 달라질 수 있습니다.
 * - **retry는 QueryProvider의 전역 기본값을 의도적으로 재정의(override)합니다.**
 *   4xx(클라이언트 오류)는 재시도하지 않고, 그 외(5xx/네트워크 오류)는 1회만 재시도합니다.
 *   개별 쿼리에서 `options.retry`를 넘기면 그 값이 우선 적용됩니다.
 *
 * @example
 * ```ts
 * useApiQuery({
 *   queryKey: QUERY_KEYS.USERS.DETAIL(userId),
 *   queryFn: () => getUser(userId), // fetchInstance 기반 함수
 * });
 * ```
 */
export const useApiQuery = <
  TQueryFnData = unknown,
  TData = TQueryFnData,
  TQueryKey extends QueryKey = QueryKey,
>(
  options: UseQueryOptions<TQueryFnData, ApiError, TData, TQueryKey>,
): UseQueryResult<TData, ApiError> =>
  useQuery({
    retry: defaultQueryRetry,
    ...options,
  });
