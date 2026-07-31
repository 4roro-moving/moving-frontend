import { ensureAccessTokenRefreshed } from "@/lib/auth/refreshAccessToken";
import { getAccessToken } from "@/lib/auth/token";
import { API_ROUTES } from "@/lib/constants/apiRoutes";
import { ApiError, type ApiSuccessResponse, type ApiErrorResponse } from "@/types/api";
import type { PaginatedApiSuccessResponse, Pagination } from "@/types/pagination";

export type { EnsureAccessTokenOptions } from "@/lib/auth/refreshAccessToken";
export { ensureAccessTokenRefreshed } from "@/lib/auth/refreshAccessToken";

const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || process.env.NEXT_PUBLIC_API_URL;
const DEFAULT_TIMEOUT_MS = 10_000;

export interface FetchRequestOptions extends RequestInit {
  /** 기본값: NEXT_PUBLIC_API_BASE_URL. auth BFF는 `/api` */
  baseURL?: string;
  /** true면 Authorization 미부착 (refresh 등) */
  skipAuth?: boolean;
  /** true면 401이어도 /auth/refresh 재시도 안 함 */
  skipRefresh?: boolean;
}

const NO_REFRESH_ENDPOINTS: readonly string[] = [
  API_ROUTES.AUTH.LOGIN,
  API_ROUTES.AUTH.SIGN_UP_CUSTOMER,
  API_ROUTES.AUTH.SIGN_UP_MOVER,
  API_ROUTES.AUTH.REFRESH,
  API_ROUTES.AUTH.LOGOUT,
  API_ROUTES.AUTH.GOOGLE_LOGIN,
  API_ROUTES.AUTH.KAKAO_LOGIN,
  API_ROUTES.AUTH.NAVER_LOGIN,
  API_ROUTES.AUTH.NAVER_OAUTH_STATE,
];

const safeFetch = async (url: string, init: RequestInit): Promise<Response> => {
  try {
    return await fetch(url, init);
  } catch (err) {
    if (err instanceof Error && err.name === "AbortError") throw err;

    if (err instanceof Error && err.name === "TimeoutError") {
      throw new ApiError("요청 시간이 초과되었습니다.");
    }

    throw new ApiError("네트워크 연결이 원활하지 않습니다.");
  }
};

const setApiError = (status: number, body: unknown): ApiError => {
  const record = typeof body === "object" && body !== null ? (body as Record<string, unknown>) : {};

  const errorInfo = "error" in record ? (record.error as ApiErrorResponse["error"]) : undefined;
  const debugInfo =
    "path" in record
      ? {
          path: record.path as string | undefined,
          method: record.method as string | undefined,
          timestamp: record.timestamp as string | undefined,
        }
      : undefined;

  return new ApiError(
    errorInfo?.message ?? "알 수 없는 오류가 발생했습니다.",
    status,
    errorInfo?.code,
    debugInfo,
  );
};

const getRequestHeaders = async (
  customHeaders?: HeadersInit,
  isFormData = false,
  options?: { skipAuth?: boolean },
): Promise<Headers> => {
  const headers = new Headers(customHeaders);

  if (!isFormData && !headers.has("Content-Type")) {
    headers.set("Content-Type", "application/json");
  }

  if (typeof window !== "undefined" && !options?.skipAuth && !headers.has("Authorization")) {
    const accessToken = getAccessToken();
    if (accessToken) {
      headers.set("Authorization", `Bearer ${accessToken}`);
    }
  }

  if (typeof window === "undefined") {
    const { cookies } = await import("next/headers");
    const cookieStore = await cookies();
    const cookieHeader = cookieStore.toString();
    if (cookieHeader) {
      headers.set("Cookie", cookieHeader);
    }
  }

  return headers;
};

const buildTimeoutSignal = (signal?: AbortSignal): AbortSignal => {
  const timeoutSignal = AbortSignal.timeout(DEFAULT_TIMEOUT_MS);

  return signal ? AbortSignal.any([signal, timeoutSignal]) : timeoutSignal;
};

type SuccessBody<T> = ApiSuccessResponse<T> | PaginatedApiSuccessResponse<T>;

const requestBody = async <T>(
  endpoint: string,
  options: FetchRequestOptions = {},
  retry = true,
): Promise<SuccessBody<T> | null> => {
  const {
    baseURL = BASE_URL,
    skipAuth,
    skipRefresh,
    headers: customHeaders,
    ...fetchOptions
  } = options;
  const isFormData = fetchOptions.body instanceof FormData;
  const headers = await getRequestHeaders(customHeaders, isFormData, { skipAuth });

  const res = await safeFetch(`${baseURL}${endpoint}`, {
    ...fetchOptions,
    credentials: "include",
    headers,
    signal: buildTimeoutSignal(fetchOptions.signal ?? undefined),
  });

  if (res.status === 204) {
    return null;
  }

  const body = (await res.json().catch(() => ({}))) as
    SuccessBody<T> | ApiErrorResponse | Record<string, never>;

  if (!res.ok || body.success === false) {
    const shouldRefresh =
      retry && !skipRefresh && res.status === 401 && !NO_REFRESH_ENDPOINTS.includes(endpoint);

    if (shouldRefresh) {
      await ensureAccessTokenRefreshed();
      return requestBody<T>(endpoint, options, false);
    }

    throw setApiError(res.status, body);
  }

  return body as SuccessBody<T>;
};

const request = async <T>(
  endpoint: string,
  options: FetchRequestOptions = {},
  retry = true,
): Promise<T> => {
  const body = await requestBody<T>(endpoint, options, retry);
  if (body === null) {
    return null as T;
  }
  return body.data;
};

const fetchInstance = {
  get: <TResponse>(endpoint: string, options?: FetchRequestOptions) =>
    request<TResponse>(endpoint, { ...options, method: "GET" }),

  getPaginated: async <TResponse>(
    endpoint: string,
    options?: FetchRequestOptions,
  ): Promise<{ data: TResponse; pagination: Pagination }> => {
    const body = await requestBody<TResponse>(endpoint, { ...options, method: "GET" });

    if (body === null) {
      throw new ApiError("페이지네이션 응답이 비어 있습니다.", 204);
    }

    if (!("pagination" in body) || body.pagination === undefined) {
      throw new ApiError("페이지네이션 응답이 올바르지 않습니다.");
    }

    return { data: body.data, pagination: body.pagination };
  },

  post: <TResponse, TBody = unknown>(
    endpoint: string,
    body?: TBody,
    options?: FetchRequestOptions,
  ) =>
    request<TResponse>(endpoint, {
      ...options,
      method: "POST",
      body: body instanceof FormData ? body : body === undefined ? undefined : JSON.stringify(body),
    }),

  patch: <TResponse, TBody = unknown>(
    endpoint: string,
    body?: TBody,
    options?: FetchRequestOptions,
  ) =>
    request<TResponse>(endpoint, {
      ...options,
      method: "PATCH",
      body: body instanceof FormData ? body : body === undefined ? undefined : JSON.stringify(body),
    }),

  delete: <TResponse>(endpoint: string, options?: FetchRequestOptions) =>
    request<TResponse>(endpoint, { ...options, method: "DELETE" }),
};

export default fetchInstance;
