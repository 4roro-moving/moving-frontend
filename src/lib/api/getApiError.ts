import { isAxiosError } from "axios";

import { ApiError } from "@/types/api";

export interface ApiErrorBody {
  success?: boolean;
  error?: {
    code?: string;
    message?: string;
  };
  message?: string;
}

/** Axios / ApiError / Error에서 백엔드 공통 에러 형식({ error: { code, message } })을 꺼냅니다. */
export function getApiError(error: unknown): { code?: string; message?: string } {
  if (error instanceof ApiError) {
    return {
      code: error.code,
      message: error.message,
    };
  }

  if (isAxiosError<ApiErrorBody>(error)) {
    return {
      code: error.response?.data?.error?.code,
      message: error.response?.data?.error?.message ?? error.response?.data?.message,
    };
  }

  if (error instanceof Error) {
    return { message: error.message };
  }

  return {};
}
