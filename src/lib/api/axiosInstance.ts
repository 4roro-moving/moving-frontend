import axios from "axios";

import { clearDevAuthTokens, getDevAccessToken, isDevAuthEnabled } from "@/lib/dev-auth";

const axiosInstance = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_BASE_URL,
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
  timeout: 10_000,
});

// 2026.07.24 정슬기 - [추가] 개발 전용 Bearer 토큰 주입 (실제 로그인 PR 병합 시 삭제/교체)
axiosInstance.interceptors.request.use((config) => {
  if (!isDevAuthEnabled()) {
    return config;
  }

  const accessToken = getDevAccessToken();
  if (accessToken) {
    config.headers.Authorization = `Bearer ${accessToken}`;
  }

  return config;
});

let isRedirectingToDevLogin = false;

// 2026.07.24 정슬기 - [추가] 개발 환경 401 시 /dev-login 이동 (무한 리다이렉트·refresh 반복 호출 방지)
axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
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
    }

    return Promise.reject(error);
  },
);

export default axiosInstance;
