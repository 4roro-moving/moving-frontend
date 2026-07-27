"use client";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { type ReactNode, useState } from "react";

import Footer from "@/components/common/Footer/Footer";
import Header from "@/components/common/Header/Header";

import "./globals.css";

interface QueryProviderProps {
  children: ReactNode;
}

export default function QueryProvider({ children }: QueryProviderProps) {
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
    <html lang="ko">
      <body className="flex min-h-screen flex-col">
        <QueryClientProvider client={queryClient}>
          {/* TODO: auth 연동 전 임시 — 알림 패널 확인용 */}
          <Header isLogin />
          <main className="flex-1">{children}</main>
          <Footer />
        </QueryClientProvider>
      </body>
    </html>
  );
}
