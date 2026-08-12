"use client";

import { QueryClient, QueryClientProvider, useQueryClient } from "@tanstack/react-query";
import { useEffect, useState, type ReactNode } from "react";

import { setAppQueryClient } from "@/providers/query/appQueryClient";
import { AuthProvider } from "@/providers/AuthProvider";

interface AppProvidersProps {
  children: ReactNode;
  hasRefreshCookie?: boolean;
}

/** Provider와 동일한 client를 브라우저 모듈에 동기 등록 */
const AppQueryClientRegistrar = ({ children }: { children: ReactNode }) => {
  const queryClient = useQueryClient();

  useEffect(() => {
    setAppQueryClient(queryClient);
  }, [queryClient]);

  return children;
};

export const AppProviders = ({ children, hasRefreshCookie = false }: AppProvidersProps) => {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            staleTime: 60 * 1000,
            retry: 1,
            refetchOnWindowFocus: false,
          },
          mutations: {
            retry: 0,
          },
        },
      }),
  );

  return (
    <QueryClientProvider client={queryClient}>
      <AppQueryClientRegistrar>
        <AuthProvider hasRefreshCookie={hasRefreshCookie}>{children}</AuthProvider>
      </AppQueryClientRegistrar>
    </QueryClientProvider>
  );
};
