"use client";

import { type ReactNode } from "react";

import Footer from "@/components/common/Footer/Footer";
import Header from "@/components/common/Header/Header";
import { AppProviders } from "@/providers/AppProviders";

interface AppShellProps {
  children: ReactNode;
  initialIsLogin: boolean;
  initialNickname: string | null;
}

/**
 * AppShell 컴포넌트
 * @param children - 자식 컴포넌트
 * @param initialIsLogin - 초기 로그인 상태
 * @param initialNickname - 초기 닉네임
 */
export const AppShell = ({ children, initialIsLogin, initialNickname }: AppShellProps) => {
  return (
    <AppProviders>
      <Header isLogin={initialIsLogin} initialNickname={initialNickname} />
      <main className="flex flex-1 flex-col">{children}</main>
      <Footer />
    </AppProviders>
  );
};
