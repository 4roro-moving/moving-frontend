import { clearAuthTokens, getAccessToken, setAccessToken } from "@/lib/auth/token";
import { notifyAuthSessionChange } from "@/lib/auth/session";
import { AUTH_BFF_BASE } from "@/lib/constants/authBff";
import { API_ROUTES } from "@/lib/constants/apiRoutes";
import { ApiError, type ApiSuccessResponse, type ApiErrorResponse } from "@/types/api";

const DEFAULT_TIMEOUT_MS = 10_000;
const REFRESH_LOCK_NAME = "moving:auth-refresh";
const REFRESH_UNAUTHORIZED_RETRY_DELAY_MS = 200;

interface RefreshTokenResponse {
  tokens: {
    accessToken: string;
  };
}

export interface EnsureAccessTokenOptions {
  /** false면 실패 시 auth:expired 미발송 (checkAuth 세션 복구용). 기본 true */
  notifyOnFailure?: boolean;
}

let refreshPromise: Promise<string> | null = null;

interface RefreshFailureMeta {
  accessTokenReplaced: boolean;
}

const isRefreshRejectedStatus = (status: number | undefined): boolean => {
  return status === 401 || status === 404;
};

const isRetryableRefreshUnauthorized = (error: unknown): boolean => {
  return error instanceof ApiError && error.status === 401;
};

const wait = (ms: number): Promise<void> => {
  return new Promise((resolve) => {
    window.setTimeout(resolve, ms);
  });
};

const withRefreshFailureMeta = (error: unknown, meta: RefreshFailureMeta): unknown => {
  if (typeof error === "object" && error !== null) {
    Object.assign(error, meta);
    return error;
  }
  return Object.assign(new Error("세션 갱신에 실패했습니다."), { cause: error, ...meta });
};

const getAccessTokenReplaced = (error: unknown): boolean => {
  if (typeof error !== "object" || error === null) {
    return false;
  }
  if (!("accessTokenReplaced" in error)) {
    return false;
  }
  return (error as RefreshFailureMeta).accessTokenReplaced === true;
};

/**
 * Next auth BFF(`/api/auth/refresh`)로 access를 재발급합니다.
 * fetchInstance와 순환 참조를 피하기 위해 same-origin fetch를 사용합니다.
 */
const requestRefreshAccessToken = async (): Promise<string> => {
  const res = await fetch(`${AUTH_BFF_BASE}${API_ROUTES.AUTH.REFRESH}`, {
    method: "POST",
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
    },
    signal: AbortSignal.timeout(DEFAULT_TIMEOUT_MS),
  }).catch((err: unknown) => {
    if (err instanceof Error && err.name === "AbortError") throw err;
    if (err instanceof Error && err.name === "TimeoutError") {
      throw new ApiError("요청 시간이 초과되었습니다.");
    }
    throw new ApiError("네트워크 연결이 원활하지 않습니다.");
  });

  const body = (await res.json().catch(() => ({}))) as
    ApiSuccessResponse<RefreshTokenResponse> | ApiErrorResponse | Record<string, never>;

  if (!res.ok || body.success === false) {
    const record =
      typeof body === "object" && body !== null ? (body as Record<string, unknown>) : {};
    const errorInfo = "error" in record ? (record.error as ApiErrorResponse["error"]) : undefined;
    throw new ApiError(
      errorInfo?.message ?? "알 수 없는 오류가 발생했습니다.",
      res.status,
      errorInfo?.code,
    );
  }

  const accessToken = (body as ApiSuccessResponse<RefreshTokenResponse>).data?.tokens?.accessToken;
  if (!accessToken) {
    throw new ApiError("세션 갱신에 실패했습니다.", res.status);
  }

  setAccessToken(accessToken);
  return accessToken;
};

/**
 * refresh 401은 다른 탭이 심은 새 쿠키가 jar에 붙기 전일 수 있어
 * 짧게 기다린 뒤 1회만 재요청합니다. 404·네트워크 오류는 재시도하지 않습니다.
 */
const requestRefreshAccessTokenWithRetry = async (): Promise<string> => {
  try {
    return await requestRefreshAccessToken();
  } catch (error) {
    if (!isRetryableRefreshUnauthorized(error)) {
      throw error;
    }

    await wait(REFRESH_UNAUTHORIZED_RETRY_DELAY_MS);
    return requestRefreshAccessToken();
  }
};

/**
 * 여러 탭의 동시 refresh를 직렬화합니다.
 * 잠금 후 다음 요청은 이 브라우저 쿠키 jar의 최신 refresh를 사용합니다.
 * F5 연타(문서 unload)는 Lock으로 막지 못하며 백엔드 rotation grace가 담당합니다.
 */
const refreshAccessTokenOnce = async (): Promise<string> => {
  const locks = typeof navigator !== "undefined" ? navigator.locks : undefined;

  if (!locks?.request) {
    return requestRefreshAccessTokenWithRetry();
  }

  return locks.request(REFRESH_LOCK_NAME, () => requestRefreshAccessTokenWithRetry());
};

/**
 * refresh 요청을 1회로 합칩니다.
 * 실패 시 부수효과는 호출부 options(notifyOnFailure)로만 제어합니다.
 */
export const ensureAccessTokenRefreshed = async (
  options?: EnsureAccessTokenOptions,
): Promise<string> => {
  const notifyOnFailure = options?.notifyOnFailure ?? true;

  if (typeof window === "undefined") {
    throw new ApiError("클라이언트에서만 세션을 갱신할 수 있습니다.");
  }

  try {
    if (!refreshPromise) {
      // promise 생성 시에만 스냅샷 — 공유 await 호출부가 login access를 지우지 않도록
      const accessTokenBeforeRefresh = getAccessToken();

      refreshPromise = refreshAccessTokenOnce()
        .catch((error: unknown) => {
          const status = error instanceof ApiError ? error.status : undefined;
          const accessTokenReplaced = getAccessToken() !== accessTokenBeforeRefresh;

          // refresh 시작 시점과 access가 같을 때만 정리 (login이 새 access를 넣었으면 유지)
          if (isRefreshRejectedStatus(status) && !accessTokenReplaced) {
            clearAuthTokens();
            notifyAuthSessionChange();
          }

          throw withRefreshFailureMeta(error, { accessTokenReplaced });
        })
        .finally(() => {
          refreshPromise = null;
        });
    }

    return await refreshPromise;
  } catch (error) {
    const status = error instanceof ApiError ? error.status : undefined;
    const accessTokenReplaced = getAccessTokenReplaced(error);

    // 로그인으로 access가 교체된 뒤의 refresh 실패는 새 세션을 지우지 않음
    if (notifyOnFailure && !accessTokenReplaced) {
      window.dispatchEvent(new CustomEvent("auth:expired"));
    } else if (!notifyOnFailure && !isRefreshRejectedStatus(status)) {
      notifyAuthSessionChange();
    }

    throw error;
  }
};
