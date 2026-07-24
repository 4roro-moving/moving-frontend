import {
  useQuery,
  type QueryKey,
  type UseQueryOptions,
  type UseQueryResult,
} from "@tanstack/react-query";

// TError 타입을 ApiError 로 고정
import { ApiError } from "@/types/api";

// 4xx(클라이언트 오류)는 재시도하지 않고, 나머지는 최대 2회까지 재시도 : query provider 참고
const isNonRetryableError = (error: unknown): boolean =>
  error instanceof ApiError && !!error.status && error.status < 500;

// 각 api 문서에서 작성한 queryKey, queryFn ... 등을 그대로 전달받아 사용
// 기본 query 사용 시 사용
export const useApiQuery = <
  TQueryFnData = unknown,
  TError = ApiError,
  TData = TQueryFnData,
  TQueryKey extends QueryKey = QueryKey,
>(
  options: UseQueryOptions<TQueryFnData, TError, TData, TQueryKey>,
): UseQueryResult<TData, TError> =>
  useQuery({
    retry: (failureCount, error) => {
      if (isNonRetryableError(error)) return false;
      return failureCount < 2;
    },
    ...options,
  });
