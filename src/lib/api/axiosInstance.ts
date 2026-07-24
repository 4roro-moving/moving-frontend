import axios, { type AxiosError, type InternalAxiosRequestConfig } from "axios";

import { clearAuthTokens, getAccessToken, setAccessToken } from "@/lib/auth/token";
import { API_ROUTES } from "@/lib/constants/apiRoutes";

type RetryConfig = InternalAxiosRequestConfig & { _retry?: boolean };

import { clearDevAuthTokens, getDevAccessToken, isDevAuthEnabled } from "@/lib/dev-auth";

const axiosInstance = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
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
        data?: {
          tokens?: {
            accessToken?: string;
          };
        };
      }>(
        `${process.env.NEXT_PUBLIC_API_URL}${API_ROUTES.AUTH.REFRESH}`,
        {},
        {
          withCredentials: true,
        },
      )
      .then((response) => {
        const accessToken = response.data.data?.tokens?.accessToken;

        if (!response.data.success || !accessToken) {
          throw new Error("세션 갱신에 실패했습니다.");
        }

        setAccessToken(accessToken);

        return accessToken;
      })
      .catch((error: unknown) => {
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
  if (isDevAuthEnabled()) {
    return config;
  }

  const accessToken = getAccessToken();

  if (accessToken) {
    config.headers.Authorization = `Bearer ${accessToken}`;
  }

  return config;
});

axiosInstance.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    if (
      isDevAuthEnabled() &&
      typeof window !== "undefined" &&
      error.response?.status === 401 &&
      !window.location.pathname.startsWith("/dev-login") &&
      !isRedirectingToDevLogin
    ) {
      isRedirectingToDevLogin = true;
      clearDevAuthTokens();
      window.location.assign("/dev-login");

      return Promise.reject(error);
    }

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

      originalRequest.headers.Authorization = `Bearer ${accessToken}`;

      return axiosInstance(originalRequest);
    } catch (refreshError) {
      return Promise.reject(refreshError);
    }
  },
);
  },
);

export default axiosInstance;
