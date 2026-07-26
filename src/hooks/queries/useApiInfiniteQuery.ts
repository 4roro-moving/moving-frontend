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

// 각 api 문서에서 작성한 queryKey, queryFn ... 등을 그대로 전달받아 사용
// infinite query 사용 시 사용
export const useApiInfiniteQuery = <
  TQueryFnData = unknown,
  TData = InfiniteData<TQueryFnData>,
  TQueryKey extends QueryKey = QueryKey,
  TPageParam = unknown,
>(
  options: UseInfiniteQueryOptions<TQueryFnData, ApiError, TData, TQueryKey, TPageParam>,
): UseInfiniteQueryResult<TData, ApiError> =>
  useInfiniteQuery({
    ...options,
    retry: defaultQueryRetry,
  });
