import { type ReactNode } from "react";
import { type Metadata } from "next";
import { cookies } from "next/headers";

import { AppShell } from "@/components/layout/AppShell";
import { safeDecodeCookieValue } from "@/lib/auth/clientStorageHint";
import { NICKNAME_STORAGE_KEY } from "@/lib/auth/nickname";
import { PROFILE_COMPLETED_STORAGE_KEY, parseProfileCompleted } from "@/lib/auth/profileCompleted";
import { PROFILE_IMAGE_STORAGE_KEY } from "@/lib/auth/profileImage";
import { ROLE_STORAGE_KEY, parseAuthRole } from "@/lib/auth/role";
import { REFRESH_TOKEN_COOKIE_NAME } from "@/lib/auth/token";

import "./globals.css";

export const metadata: Metadata = {
  title: "무빙",
  description: "이사 견적을 비교하고 믿을 수 있는 기사님을 찾는 플랫폼, 무빙",
  icons: {
    icon: "/icons/moving-logo-icon.svg",
  },
};

interface RootLayoutProps {
  children: ReactNode;
}

const RootLayout = async ({ children }: RootLayoutProps) => {
  const cookieStore = await cookies();
  const initialIsLogin = Boolean(cookieStore.get(REFRESH_TOKEN_COOKIE_NAME));
  const rawProfileImage = cookieStore.get(PROFILE_IMAGE_STORAGE_KEY)?.value;
  const initialProfileImage = rawProfileImage ? safeDecodeCookieValue(rawProfileImage) : null;
  const rawNickname = cookieStore.get(NICKNAME_STORAGE_KEY)?.value;
  const initialNickname = rawNickname ? safeDecodeCookieValue(rawNickname) : null;
  const rawRole = cookieStore.get(ROLE_STORAGE_KEY)?.value;
  const decodedRole = rawRole ? safeDecodeCookieValue(rawRole) : null;
  const initialRole = parseAuthRole(decodedRole);
  const initialProfileCompleted = parseProfileCompleted(
    cookieStore.get(PROFILE_COMPLETED_STORAGE_KEY)?.value,
  );

  return (
    <html lang="ko">
      <body className="flex min-h-screen flex-col">
        <AppShell
          initialIsLogin={initialIsLogin}
          initialNickname={initialNickname}
          initialRole={initialRole}
          initialProfileImage={initialProfileImage}
          initialProfileCompleted={initialProfileCompleted}
        >
          {children}
        </AppShell>
      </body>
    </html>
  );
};

export default RootLayout;
