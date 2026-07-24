import { isAxiosError } from "axios";

export interface ApiErrorBody {
  success?: boolean;
  error?: {
    code?: string;
    message?: string;
  };
  message?: string;
}

/** Axios / Error에서 백엔드 공통 에러 형식({ error: { code, message } })을 꺼냅니다. */
export function getApiError(error: unknown): { code?: string; message?: string } {
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
