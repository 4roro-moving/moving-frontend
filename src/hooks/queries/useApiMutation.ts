import {
  useMutation,
  type UseMutationOptions,
  type UseMutationResult,
} from "@tanstack/react-query";

// TError 타입을 ApiError 로 고정
import { ApiError } from "@/types/api";

// 각 api 문서에서 작성한 mutationKey, mutationFn ... 등을 그대로 전달받아 사용
// 기본 mutation 사용 시 사용
export const useApiMutation = <TData = unknown, TVariables = void, TContext = unknown>(
  options: UseMutationOptions<TData, ApiError, TVariables, TContext>,
): UseMutationResult<TData, ApiError, TVariables, TContext> => useMutation(options);
