import { isAxiosError } from "axios";

import { getValidationDataMessage } from "@/lib/api/getValidationDataMessage";
import { ApiError } from "@/types/api";

export interface ApiErrorBody {
  success?: boolean;
  error?: {
    code?: string;
    message?: string;
    data?: unknown;
  };
  message?: string;
}

/** Axios / ApiError / Error에서 백엔드 공통 에러 형식({ error: { code, message } })을 꺼냅니다. */
export const getApiError = (
  error: unknown,
): { code?: string; message?: string; data?: unknown } => {
  if (error instanceof ApiError) {
    const validationMessage =
      error.code === "VALIDATION_ERROR" ? getValidationDataMessage(error.data?.details) : undefined;

    return {
      code: error.code,
      message: validationMessage ?? error.message,
      data: error.data?.details,
    };
  }

  if (isAxiosError<ApiErrorBody>(error)) {
    const code = error.response?.data?.error?.code;
    const validationMessage =
      code === "VALIDATION_ERROR"
        ? getValidationDataMessage(error.response?.data?.error?.data)
        : undefined;

    return {
      code,
      message:
        validationMessage ?? error.response?.data?.error?.message ?? error.response?.data?.message,
      data: error.response?.data?.error?.data,
    };
  }

  if (error instanceof Error) {
    return { message: error.message };
  }

  return {};
};
