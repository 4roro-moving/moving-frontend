import axios, { type AxiosError, type InternalAxiosRequestConfig } from "axios";

import { clearAuthTokens, getAccessToken, setAccessToken } from "@/lib/auth/token";
import { API_ROUTES } from "@/lib/constants/apiRoutes";
import { clearDevAuthTokens, getDevAccessToken, isDevAuthEnabled } from "@/lib/dev-auth";

type RetryConfig = InternalAxiosRequestConfig & { _retry?: boolean };

const axiosInstance = axios.create({
  // 프로젝트 .env는 NEXT_PUBLIC_API_BASE_URL 사용 (예: http://localhost:5000/api)
  baseURL: process.env.NEXT_PUBLIC_API_BASE_URL,
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
  timeout: 10_000,
});

let refreshPromise: Promise<string> | null = null;
let isRedirectingToDevLogin = false;

function isAuthPath(url?: string): boolean {
  if (!url) return false;
  return (
    url.includes(API_ROUTES.AUTH.LOGIN) ||
    url.includes(API_ROUTES.AUTH.REFRESH) ||
    url.includes(API_ROUTES.AUTH.LOGOUT)
  );
}

async function refreshAccessToken(): Promise<string> {
  if (!refreshPromise) {
    refreshPromise = axios
      .post<{
        success: boolean;
        data?: { tokens?: { accessToken?: string } };
      }>(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}${API_ROUTES.AUTH.REFRESH}`,
        {},
        { withCredentials: true },
      )
      .then((response) => {
        const accessToken = response.data.data?.tokens?.accessToken;
        if (!response.data.success || !accessToken) {
          throw new Error("세션 갱신에 실패했습니다.");
        }
        setAccessToken(accessToken);
        return accessToken;
      })
      .catch((error) => {
        clearAuthTokens();
        throw error;
      })
      .finally(() => {
        refreshPromise = null;
      });
  }

  return refreshPromise;
}

axiosInstance.interceptors.request.use((config) => {
  // 2026.07.24 정슬기 - [수정] 개발 로그인은 sessionStorage 토큰, 그 외는 메모리 토큰 주입
  const accessToken = isDevAuthEnabled() ? getDevAccessToken() : getAccessToken();
  if (accessToken) {
    config.headers.set("Authorization", `Bearer ${accessToken}`);
  }
  return config;
});

axiosInstance.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const originalRequest = error.config as RetryConfig | undefined;

    if (
      !originalRequest ||
      error.response?.status !== 401 ||
      originalRequest._retry ||
      isAuthPath(originalRequest.url)
    ) {
      return Promise.reject(error);
    }

    originalRequest._retry = true;

    try {
      const accessToken = await refreshAccessToken();
      originalRequest.headers.set("Authorization", `Bearer ${accessToken}`);
      return axiosInstance(originalRequest);
    } catch (refreshError) {
      // 2026.07.24 정슬기 - [수정] 개발 환경에서는 refresh 실패 시 /dev-login으로 유도
      if (
        isDevAuthEnabled() &&
        typeof window !== "undefined" &&
        !window.location.pathname.startsWith("/dev-login") &&
        !isRedirectingToDevLogin
      ) {
        isRedirectingToDevLogin = true;
        clearDevAuthTokens();
        clearAuthTokens();
        window.location.assign("/dev-login");
      }

      return Promise.reject(refreshError);
    }
  },
);

export default axiosInstance;
