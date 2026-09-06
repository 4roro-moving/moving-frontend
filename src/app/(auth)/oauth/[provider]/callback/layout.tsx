import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import type { ReactNode } from "react";

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations("auth");

  return {
    title: t("oauthProcessing"),
    description: t("checkingLoginStatus"),
    robots: {
      index: false,
      follow: false,
    },
  };
}

export default function OAuthCallbackLayout({ children }: { children: ReactNode }) {
  return children;
}
