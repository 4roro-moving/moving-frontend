import { ApiError } from "@/types/api";

// 4xx(클라이언트 오류)는 재시도하지 않고, 나머지는 최대 1회까지 재시도 : query provider 참고
const isNonRetryableError = (error: unknown): boolean =>
  error instanceof ApiError && !!error.status && error.status >= 400 && error.status < 500;

export const defaultQueryRetry = (failureCount: number, error: unknown): boolean => {
  if (isNonRetryableError(error)) return false;
  return failureCount < 1;
};
