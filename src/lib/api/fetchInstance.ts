import { clearAuthTokens, getAccessToken, setAccessToken } from "@/lib/auth/token";
import { API_ROUTES } from "@/lib/constants/apiRoutes";
import { notifyAuthSessionChange } from "@/lib/auth/session";
import {
  clearDevAuthTokens,
  getDevAccessToken,
  isDevAuthEnabled,
  setDevAuthTokens,
} from "@/lib/dev-auth";
import { ApiError, type ApiSuccessResponse, type ApiErrorResponse } from "@/types/api";
import type { PaginatedApiSuccessResponse, Pagination } from "@/types/pagination";

const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || process.env.NEXT_PUBLIC_API_URL;
const DEFAULT_TIMEOUT_MS = 10_000;

// auth 엔드포인트 제외 리프레시 금지
const NO_REFRESH_ENDPOINTS: readonly string[] = [
  API_ROUTES.AUTH.LOGIN,
  API_ROUTES.AUTH.SIGN_UP_CUSTOMER,
  API_ROUTES.AUTH.SIGN_UP_MOVER,
  API_ROUTES.AUTH.REFRESH,
  API_ROUTES.AUTH.LOGOUT,
];

// 예외 처리 공통 함수
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

// error 처리 공통 함수
// status 와 body 를 받아 ApiError 를 반환
const setApiError = (status: number, body: unknown): ApiError => {
  // body 타입에 SuccessResponese 가 있을 수 있으므로 unknown으로 정의하고 따로 체크
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

/** axiosInstance와 동일 기준으로 Access Token을 고른다. */
function resolveAccessToken(): string | null {
  return isDevAuthEnabled() ? getDevAccessToken() : getAccessToken();
}

// 서버(Server Component 등)에서 실행 중이면 브라우저 쿠키가 자동으로 안 실리므로 직접 포워딩한다.
const getRequestHeaders = async (
  customHeaders?: HeadersInit,
  isFormData = false,
  options?: { skipAuth?: boolean },
): Promise<Headers> => {
  const headers = new Headers(customHeaders);

  if (!isFormData && !headers.has("Content-Type")) {
    headers.set("Content-Type", "application/json");
  }
  // 백엔드 authenticate는 Authorization: Bearer 만 본다 (axiosInstance와 동일)

  if (typeof window !== "undefined" && !options?.skipAuth && !headers.has("Authorization")) {
    const accessToken = resolveAccessToken();
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

// fetch 요청 시간 제한 신호 생성 / axios의 timeout 대신 사용
const buildTimeoutSignal = (signal?: AbortSignal): AbortSignal => {
  const timeoutSignal = AbortSignal.timeout(DEFAULT_TIMEOUT_MS);

  return signal ? AbortSignal.any([signal, timeoutSignal]) : timeoutSignal;
};

interface RefreshTokenResponse {
  tokens: {
    accessToken: string;
  };
}

interface EnsureAccessTokenOptions {
  /** false면 실패 시 auth:expired 미발송 (앱 시작 세션 복구용) */
  notifyOnFailure?: boolean;
}

/** Refresh Cookie 기반 재발급 — body 없음 */
const refreshAccessToken = async (): Promise<void> => {
  const headers = await getRequestHeaders(undefined, false, { skipAuth: true });

  const res = await safeFetch(`${BASE_URL}${API_ROUTES.AUTH.REFRESH}`, {
    method: "POST",
    credentials: "include",
    signal: buildTimeoutSignal(),
  });

  const body = (await res.json().catch(() => ({}))) as
    ApiSuccessResponse<RefreshTokenResponse> | ApiErrorResponse | Record<string, never>;

  if (!res.ok || body.success === false) {
    clearAuthTokens();
    throw setApiError(res.status, body);
  }

  const accessToken = (body as ApiSuccessResponse<RefreshTokenResponse>).data?.tokens?.accessToken;
  if (!accessToken) {
    clearAuthTokens();
    throw new ApiError("세션 갱신에 실패했습니다.", res.status);
  }

  if (isDevAuthEnabled()) {
    setDevAuthTokens({ accessToken });
    return;
  }

  setAccessToken(accessToken);
};

// 401·세션 복구 시 refresh 동시 요청 제어
let refreshPromise: Promise<void> | null = null;

/** refresh 요청을 1회로 합칩니다. (Strict Mode·병렬 401 대비) */
export const ensureAccessTokenRefreshed = (options?: EnsureAccessTokenOptions): Promise<void> => {
  const notifyOnFailure = options?.notifyOnFailure ?? true;

  // SSR 에서는 캐싱하지 않고 매번 새로 호출함.
  if (typeof window === "undefined") {
    return refreshAccessToken();
  }

  if (!refreshPromise) {
    refreshPromise = refreshAccessToken()
      .catch((err) => {
        // refresh 실패 = 세션 종료. 잔여 Access만 남으면 비로그인인데 찜 API를 치는 상태가 됨
        clearAuthTokens();
        if (isDevAuthEnabled()) {
          clearDevAuthTokens();
        } else {
          notifyAuthSessionChange();
        }
        throw err;
      })
      .finally(() => {
        refreshPromise = null;
      });
  }

  return refreshPromise;
};

const getRefreshPromise = ensureAccessTokenRefreshed;

/** 일반 성공 응답 + 목록(pagination 포함) 성공 응답 */
type SuccessBody<T> = ApiSuccessResponse<T> | PaginatedApiSuccessResponse<T>;

/**
 * 공통 fetch 함수 (인증·에러 처리 포함)
 * 성공 시 body 전체 반환, 실패 시 401이면 refresh 후 1회 재시도, 아니면 ApiError throw
 * 기존 request는 body.data만 반환해 pagination이 유실됨 → unwrap 전 단계로 분리
 */
const requestBody = async <T>(
  endpoint: string,
  options: RequestInit = {},
  retry = true,
): Promise<SuccessBody<T> | null> => {
  const isFormData = options.body instanceof FormData;
  const headers = await getRequestHeaders(options.headers, isFormData);

  const res = await safeFetch(`${BASE_URL}${endpoint}`, {
    ...options,
    credentials: "include",
    headers,
    signal: buildTimeoutSignal(options.signal ?? undefined),
  });

  if (res.status === 204) {
    return null;
  }

  const body = (await res.json().catch(() => ({}))) as
    SuccessBody<T> | ApiErrorResponse | Record<string, never>;

  if (!res.ok || body.success === false) {
    const shouldRefresh = retry && res.status === 401 && !NO_REFRESH_ENDPOINTS.includes(endpoint);

    if (shouldRefresh) {
      await getRefreshPromise();
      return requestBody<T>(endpoint, options, false);
    }

    throw setApiError(res.status, body);
  }

  return body as SuccessBody<T>;
};

/** 기존 request 역할: requestBody에서 data만 꺼내 get/post/patch/delete에 전달 */
const request = async <T>(
  endpoint: string,
  options: RequestInit = {},
  retry = true,
): Promise<T> => {
  const body = await requestBody<T>(endpoint, options, retry);
  if (body === null) {
    return null as T;
  }
  return body.data;
};

// API 요청 함수 모음 (axios 대신 사용)
const fetchInstance = {
  get: <TResponse>(endpoint: string, options?: RequestInit) =>
    request<TResponse>(endpoint, { ...options, method: "GET" }),

  /**
   * 목록 API용 GET — requestBody로 body를 유지해 { data, pagination } 반환
   * (get → request 경로를 타면 data만 남아 pagination이 유실됨)
   */
  getPaginated: async <TResponse>(
    endpoint: string,
    options?: RequestInit,
  ): Promise<{ data: TResponse; pagination: Pagination }> => {
    const body = await requestBody<TResponse>(endpoint, { ...options, method: "GET" });

    // 2026.07.27 정슬기 - [수정] request와 동일하게 204 가드 (빈 pagination 반환 방지)
    if (body === null) {
      throw new ApiError("페이지네이션 응답이 비어 있습니다.", 204);
    }

    if (!("pagination" in body) || body.pagination === undefined) {
      throw new ApiError("페이지네이션 응답이 올바르지 않습니다.");
    }

    return { data: body.data, pagination: body.pagination };
  },

  post: <TResponse, TBody = unknown>(endpoint: string, body?: TBody, options?: RequestInit) =>
    request<TResponse>(endpoint, {
      ...options,
      method: "POST",
      body: body instanceof FormData ? body : body === undefined ? undefined : JSON.stringify(body),
    }),

  patch: <TResponse, TBody = unknown>(endpoint: string, body?: TBody, options?: RequestInit) =>
    request<TResponse>(endpoint, {
      ...options,
      method: "PATCH",
      body: body instanceof FormData ? body : body === undefined ? undefined : JSON.stringify(body),
    }),

  delete: <TResponse>(endpoint: string, options?: RequestInit) =>
    request<TResponse>(endpoint, { ...options, method: "DELETE" }),
};

export default fetchInstance;
