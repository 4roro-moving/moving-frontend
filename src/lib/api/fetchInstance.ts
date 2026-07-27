import { API_ROUTES } from "@/lib/constants/apiRoutes";
import { ApiError, type ApiSuccessResponse, type ApiErrorResponse } from "@/types/api";

const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || process.env.NEXT_PUBLIC_API_URL;
const DEFAULT_TIMEOUT_MS = 10_000;

// auth 엔드포인트 제외 리프레시 금지
const NO_REFRESH_ENDPOINTS: readonly string[] = [
  API_ROUTES.AUTH.LOGIN,
  API_ROUTES.AUTH.SIGN_UP_CUSTOMER,
  API_ROUTES.AUTH.SIGN_UP_MOVER,
  API_ROUTES.AUTH.REFRESH,
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

// 서버(Server Component 등)에서 실행 중이면 브라우저 쿠키가 자동으로 안 실리므로 직접 포워딩한다.
const getRequestHeaders = async (
  customHeaders?: HeadersInit,
  isFormData = false,
): Promise<Headers> => {
  const headers = new Headers(customHeaders);

  if (!isFormData && !headers.has("Content-Type")) {
    headers.set("Content-Type", "application/json");
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

// 토큰 리프레시 요청
const refreshAccessToken = async (): Promise<void> => {
  // SSR 에서는 쿠키 헤더 추가
  const headers = await getRequestHeaders();

  const res = await safeFetch(`${BASE_URL}${API_ROUTES.AUTH.REFRESH}`, {
    method: "POST",
    credentials: "include",
    headers,
    signal: buildTimeoutSignal(),
  });

  if (!res.ok) {
    const body = (await res.json().catch(() => ({}))) as ApiErrorResponse | Record<string, never>;
    throw setApiError(res.status, body);
  }
};

// 401 동시 요청 제어
let refreshPromise: Promise<void> | null = null;

const getRefreshPromise = (): Promise<void> => {
  // SSR 에서는 캐싱하지 않고 매번 새로 호출함.
  if (typeof window === "undefined") {
    return refreshAccessToken();
  }

  if (!refreshPromise) {
    refreshPromise = refreshAccessToken()
      .catch((err) => {
        // token 발급 실패 시 에러 처리
        // 추후 authProvider 에서 addEventListner로 처리할 예정
        window.dispatchEvent(new CustomEvent("auth:expired"));
        throw err;
      })
      .finally(() => {
        refreshPromise = null;
      });
  }

  return refreshPromise;
};

// fetch 요청 함수
const request = async <T>(
  endpoint: string,
  options: RequestInit = {},
  retry = true,
): Promise<T> => {
  const isFormData = options.body instanceof FormData;
  const headers = await getRequestHeaders(options.headers, isFormData);

  const res = await safeFetch(`${BASE_URL}${endpoint}`, {
    ...options,
    credentials: "include",
    headers,
    signal: buildTimeoutSignal(options.signal ?? undefined),
  });

  if (res.status === 204) {
    return null as T;
  }

  const body = (await res.json().catch(() => ({}))) as
    ApiSuccessResponse<T> | ApiErrorResponse | Record<string, never>;

  if (!res.ok || body.success === false) {
    const shouldRefresh = retry && res.status === 401 && !NO_REFRESH_ENDPOINTS.includes(endpoint);

    if (shouldRefresh) {
      await getRefreshPromise();
      return request<T>(endpoint, options, false);
    }

    throw setApiError(res.status, body);
  }

  return (body as ApiSuccessResponse<T>).data;
};

// API 요청 함수 모음 (axios 대신 사용)
const fetchInstance = {
  get: <TResponse>(endpoint: string, options?: RequestInit) =>
    request<TResponse>(endpoint, { ...options, method: "GET" }),

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
