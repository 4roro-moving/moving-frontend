import type { ErrorCode } from "@/lib/constants/errorCodes";

export interface ApiSuccessResponse<T> {
  success: true;
  message?: string;
  data: T;
}

export interface ApiErrorResponse {
  success: false;
  error: {
    code: ErrorCode;
    message: string;
  };
  path?: string;
  method?: string;
  timestamp?: string;
}

export class ApiError extends Error {
  status?: number;
  code?: ErrorCode;
  data?: unknown; // path/method/timestamp 등 디버깅용 정보

  constructor(message: string, status?: number, code?: ErrorCode, data?: unknown) {
    super(message);
    this.name = "ApiError";
    this.status = status;
    this.code = code;
    this.data = data;
  }
}
