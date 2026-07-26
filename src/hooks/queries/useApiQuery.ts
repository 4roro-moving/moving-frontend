import {
  useQuery,
  type QueryKey,
  type UseQueryOptions,
  type UseQueryResult,
} from "@tanstack/react-query";

// TError 타입을 ApiError 로 고정
import { ApiError } from "@/types/api";

import { defaultQueryRetry } from "@/lib/utils/queryDefaults";

// 각 api 문서에서 작성한 queryKey, queryFn ... 등을 그대로 전달받아 사용
// 기본 query 사용 시 사용
export const useApiQuery = <
  TQueryFnData = unknown,
  TData = TQueryFnData,
  TQueryKey extends QueryKey = QueryKey,
>(
  options: UseQueryOptions<TQueryFnData, ApiError, TData, TQueryKey>,
): UseQueryResult<TData, ApiError> =>
  useQuery({
    ...options,
    retry: defaultQueryRetry,
  });
