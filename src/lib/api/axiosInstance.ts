import axios, { type AxiosError, type InternalAxiosRequestConfig } from "axios";

import { ensureAccessTokenRefreshed } from "@/lib/auth/refreshAccessToken";
import { getAccessToken } from "@/lib/auth/token";
import { API_ROUTES } from "@/lib/constants/apiRoutes";

type RetryConfig = InternalAxiosRequestConfig & { _retry?: boolean };

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || process.env.NEXT_PUBLIC_API_URL;

const axiosInstance = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
  timeout: 10_000,
});

const isAuthPath = (url?: string): boolean => {
  if (!url) return false;
  return (
    url.includes(API_ROUTES.AUTH.LOGIN) ||
    url.includes(API_ROUTES.AUTH.REFRESH) ||
    url.includes(API_ROUTES.AUTH.LOGOUT)
  );
};

axiosInstance.interceptors.request.use((config) => {
  const accessToken = getAccessToken();
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
      const accessToken = await ensureAccessTokenRefreshed();
      originalRequest.headers.set("Authorization", `Bearer ${accessToken}`);
      return axiosInstance(originalRequest);
    } catch (refreshError) {
      return Promise.reject(refreshError);
    }
  },
);

export default axiosInstance;
