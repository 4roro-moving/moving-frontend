import type { QueryClient } from "@tanstack/react-query";

let appQueryClient: QueryClient | null = null;

/** AppProviders에서 QueryClient 인스턴스를 등록합니다. */
export const setAppQueryClient = (queryClient: QueryClient): void => {
  appQueryClient = queryClient;
};

/** 로그아웃·세션 만료 시 사용자 데이터가 섞이지 않도록 캐시를 비웁니다. */
export const clearAppQueryCache = (): void => {
  appQueryClient?.clear();
};
