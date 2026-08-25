import { getTranslations } from "next-intl/server";
import { type ReactNode } from "react";
import { type Metadata } from "next";
import { cookies } from "next/headers";

import { AppShell } from "@/components/layout/AppShell";
import { resolveLocale } from "@/i18n/config";
import { LOCALE_COOKIE_NAME } from "@/i18n/config";
import { NextIntlClientProvider } from "next-intl";
import { safeDecodeCookieValue } from "@/lib/auth/clientStorageHint";
import { NICKNAME_STORAGE_KEY, sanitizeSoftUxNickname } from "@/lib/auth/nickname";
import { PROFILE_COMPLETED_STORAGE_KEY, parseProfileCompleted } from "@/lib/auth/profileCompleted";
import { PROFILE_IMAGE_STORAGE_KEY, sanitizeSoftUxProfileImageUrl } from "@/lib/auth/profileImage";
import { ROLE_STORAGE_KEY, parseSoftUxAuthRole } from "@/lib/auth/role";
import { REFRESH_TOKEN_COOKIE_NAME } from "@/lib/auth/token";

import "./globals.css";

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations("common");
  return { title: t("metadata.title"), description: t("metadata.description") };
}

interface RootLayoutProps {
  children: ReactNode;
}

const RootLayout = async ({ children }: RootLayoutProps) => {
  const cookieStore = await cookies();
  /** SSR 시점 HttpOnly refreshToken 쿠키 존재 여부 (로그인 Soft UX·선제 refresh 힌트) */
  const hasRefreshCookie = Boolean(cookieStore.get(REFRESH_TOKEN_COOKIE_NAME));
  const rawProfileImage = cookieStore.get(PROFILE_IMAGE_STORAGE_KEY)?.value;
  const initialLocale = resolveLocale(cookieStore.get(LOCALE_COOKIE_NAME)?.value);
  const initialProfileImage = sanitizeSoftUxProfileImageUrl(
    rawProfileImage ? safeDecodeCookieValue(rawProfileImage) : null,
  );
  const rawNickname = cookieStore.get(NICKNAME_STORAGE_KEY)?.value;
  const initialNickname = sanitizeSoftUxNickname(
    rawNickname ? safeDecodeCookieValue(rawNickname) : null,
  );
  const rawRole = cookieStore.get(ROLE_STORAGE_KEY)?.value;
  const decodedRole = rawRole ? safeDecodeCookieValue(rawRole) : null;
  const initialRole = parseSoftUxAuthRole(decodedRole);
  const initialProfileCompleted = parseProfileCompleted(
    cookieStore.get(PROFILE_COMPLETED_STORAGE_KEY)?.value,
  );

  return (
    <html lang={initialLocale}>
      <body className="flex min-h-screen flex-col">
        <NextIntlClientProvider>
          <AppShell
            hasRefreshCookie={hasRefreshCookie}
            initialNickname={initialNickname}
            initialRole={initialRole}
            initialProfileImage={initialProfileImage}
            initialProfileCompleted={initialProfileCompleted}
          >
            {children}
          </AppShell>
        </NextIntlClientProvider>
      </body>
    </html>
  );
};

export default RootLayout;
