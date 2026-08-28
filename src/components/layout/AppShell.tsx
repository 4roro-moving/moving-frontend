"use client";

import { type ReactNode } from "react";

import Footer from "@/components/common/Footer/Footer";
import Header from "@/components/common/Header/Header";
import ScrollToTopButton from "@/components/common/ScrollToTopButton";
import type { AuthRole } from "@/lib/auth/role";
import { AppProviders } from "@/providers/AppProviders";

interface AppShellProps {
  children: ReactNode;
  /** SSR: HttpOnly refreshToken 쿠키 존재 여부 */
  hasRefreshCookie: boolean;
  initialNickname: string | null;
  initialRole: AuthRole | null;
  initialProfileImage: string | null;
  initialProfileCompleted: boolean | null;
}

/**
 * AppShell 컴포넌트
 * @param children - 자식 컴포넌트
 * @param hasRefreshCookie - SSR refreshToken 쿠키 존재 여부 (Header Soft UX·checkAuth 힌트)
 * @param initialNickname - 초기 닉네임
 * @param initialRole - 초기 role (nav 분기 SSR 힌트)
 * @param initialProfileImage - 초기 프로필 이미지
 * @param initialProfileCompleted - 초기 프로필 완료 여부 (GNB Soft UX 힌트)
 * // 2026.08.03 정슬기 - [수정] 공통 ScrollToTopButton 마운트
 */
export const AppShell = ({
  children,
  hasRefreshCookie,
  initialNickname,
  initialRole,
  initialProfileImage,
  initialProfileCompleted,
}: AppShellProps) => {
  return (
    <AppProviders hasRefreshCookie={hasRefreshCookie}>
      <Header
        isLogin={hasRefreshCookie}
        initialNickname={initialNickname}
        initialRole={initialRole}
        initialProfileImage={initialProfileImage}
        initialProfileCompleted={initialProfileCompleted}
      />
      <main className="flex flex-1 flex-col">{children}</main>
      <Footer />
      <ScrollToTopButton />
    </AppProviders>
  );
};
