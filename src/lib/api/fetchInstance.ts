import { API_ROUTES } from "@/lib/constants/apiRoutes";
import { ApiError, type ApiSuccessResponse, type ApiErrorResponse } from "@/types/api";

const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;
const DEFAULT_TIMEOUT_MS = 10_000;

// auth 엔드포인트 제외 리프레시 금지
const NO_REFRESH_ENDPOINTS: string[] = [
  API_ROUTES.AUTH.SIGN_IN,
  API_ROUTES.AUTH.SIGN_UP,
  API_ROUTES.AUTH.REFRESH,
];

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
  const headers = await getRequestHeaders();

  const res = await fetch(`${BASE_URL}${API_ROUTES.AUTH.REFRESH}`, {
    method: "POST",
    credentials: "include",
    headers,
    signal: buildTimeoutSignal(),
  });

  if (!res.ok) {
    throw new ApiError("로그인이 만료되었습니다.", 401);
  }
};

// fetch 요청 함수
const request = async <T>(
  endpoint: string,
  options: RequestInit = {},
  retry = true,
): Promise<T> => {
  const isFormData = options.body instanceof FormData;
  let res: Response;

  try {
    const headers = await getRequestHeaders(options.headers, isFormData);
    res = await fetch(`${BASE_URL}${endpoint}`, {
      ...options,
      credentials: "include",
      headers,
      signal: buildTimeoutSignal(options.signal ?? undefined),
    });
  } catch (err) {
    // 요청 중단 시 에러 처리
    if (err instanceof Error && err.name === "AbortError") throw err;

    // 타임 아웃 시 에러 처리
    if (err instanceof Error && err.name === "TimeoutError") {
      throw new ApiError("요청 시간이 초과되었습니다.", undefined);
    }

    throw new ApiError("네트워크 연결이 원활하지 않습니다.", undefined);
  }

  if (res.status === 204) {
    return null as T;
  }

  const body = (await res.json().catch(() => ({}))) as
    ApiSuccessResponse<T> | ApiErrorResponse | Record<string, never>;

  if (!res.ok || body.success === false) {
    const shouldRefresh = retry && res.status === 401 && !NO_REFRESH_ENDPOINTS.includes(endpoint);

    if (shouldRefresh) {
      await refreshAccessToken();
      return request<T>(endpoint, options, false);
    }

    const errorInfo = "error" in body ? body.error : undefined;
    const debugInfo =
      "path" in body
        ? { path: body.path, method: body.method, timestamp: body.timestamp }
        : undefined;

    throw new ApiError(
      errorInfo?.message ?? "알 수 없는 오류가 발생했습니다.",
      res.status,
      errorInfo?.code,
      debugInfo,
    );
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
      body: body instanceof FormData ? body : JSON.stringify(body),
    }),

  patch: <TResponse, TBody = unknown>(endpoint: string, body?: TBody, options?: RequestInit) =>
    request<TResponse>(endpoint, {
      ...options,
      method: "PATCH",
      body: body instanceof FormData ? body : JSON.stringify(body),
    }),

  delete: <TResponse>(endpoint: string, options?: RequestInit) =>
    request<TResponse>(endpoint, { ...options, method: "DELETE" }),
};

export default fetchInstance;
