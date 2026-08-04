"use client";

import { type ReactNode } from "react";

import Footer from "@/components/common/Footer/Footer";
import Header from "@/components/common/Header/Header";
import ScrollToTopButton from "@/components/common/ScrollToTopButton";
import type { AuthRole } from "@/lib/auth/role";
import { AppProviders } from "@/providers/AppProviders";

interface AppShellProps {
  children: ReactNode;
  initialIsLogin: boolean;
  initialNickname: string | null;
  initialRole: AuthRole | null;
}

/**
 * AppShell 컴포넌트
 * @param children - 자식 컴포넌트
 * @param initialIsLogin - 초기 로그인 상태
 * @param initialNickname - 초기 닉네임
 * @param initialRole - 초기 role (nav 분기 SSR 힌트)
 * // 2026.08.03 정슬기 - [수정] 공통 ScrollToTopButton 마운트
 */
export const AppShell = ({
  children,
  initialIsLogin,
  initialNickname,
  initialRole,
}: AppShellProps) => {
  return (
    <AppProviders>
      <Header
        isLogin={initialIsLogin}
        initialNickname={initialNickname}
        initialRole={initialRole}
      />
      <main className="flex flex-1 flex-col">{children}</main>
      <Footer />
      <ScrollToTopButton />
    </AppProviders>
  );
};
