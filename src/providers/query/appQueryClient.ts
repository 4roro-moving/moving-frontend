import type { QueryClient } from "@tanstack/react-query";

let appQueryClient: QueryClient | null = null;

/**
 * AppProviders(AppQueryClientRegistrar)에서 Provider와 동일한 client를 등록합니다.
 * useState 초기화 시점 set은 SSR에만 실행되므로 사용하지 않습니다.
 */
export const setAppQueryClient = (queryClient: QueryClient): void => {
  appQueryClient = queryClient;
};

/** 로그아웃·세션 만료 시 사용자 데이터가 섞이지 않도록 캐시를 비웁니다. */
export const clearAppQueryCache = (): void => {
  appQueryClient?.clear();
};
