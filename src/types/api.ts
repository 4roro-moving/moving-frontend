import type { ErrorCode } from "@/lib/constants/errorCodes";

export interface ApiSuccessResponse<T> {
  success: true;
  message?: string;
  data: T;
}

export interface ApiErrorData {
  /** BE `error.data` (zod issues 배열 등) */
  details?: unknown;
  path?: string;
  method?: string;
  timestamp?: string;
}

export interface ApiErrorResponse {
  success: false;
  error: {
    code: ErrorCode;
    message: string;
    data?: unknown;
  };
  path?: string;
  method?: string;
  timestamp?: string;
}

export class ApiError extends Error {
  status?: number;
  code?: ErrorCode;
  data?: ApiErrorData;

  constructor(message: string, status?: number, code?: ErrorCode, data?: ApiErrorData) {
    super(message);
    this.name = "ApiError";
    this.status = status;
    this.code = code;
    this.data = data;
  }
}
