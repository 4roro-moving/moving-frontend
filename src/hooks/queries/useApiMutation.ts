import {
  useMutation,
  type UseMutationOptions,
  type UseMutationResult,
} from "@tanstack/react-query";

// TError 타입을 ApiError 로 고정
import { ApiError } from "@/types/api";

/**
 * useMutation의 공통 래퍼.
 *
 * @remarks
 * - TError는 `ApiError`로 고정되어 있습니다. mutationFn은 반드시 `fetchInstance` 기반 함수여야 합니다.
 */
export const useApiMutation = <TData = unknown, TVariables = void, TContext = unknown>(
  options: UseMutationOptions<TData, ApiError, TVariables, TContext>,
): UseMutationResult<TData, ApiError, TVariables, TContext> => useMutation(options);
