import { type ReactNode } from "react";
import { cookies } from "next/headers";

import { AppShell } from "@/components/layout/AppShell";
import { NICKNAME_STORAGE_KEY } from "@/lib/auth/nickname";

import "./globals.css";

interface RootLayoutProps {
  children: ReactNode;
}

const RootLayout = async ({ children }: RootLayoutProps) => {
  const cookieStore = await cookies();
  const initialIsLogin = Boolean(cookieStore.get("refreshToken"));
  const rawNickname = cookieStore.get(NICKNAME_STORAGE_KEY)?.value;
  const initialNickname = rawNickname ? decodeURIComponent(rawNickname) : null;

  return (
    <html lang="ko">
      <body className="flex min-h-screen flex-col">
        <AppShell initialIsLogin={initialIsLogin} initialNickname={initialNickname}>
          {children}
        </AppShell>
      </body>
    </html>
  );
};

export default RootLayout;
