import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { cookies } from "next/headers";

import ResidenceReviewPageView from "@/components/residence-review/ResidenceReviewPageView";
import { safeDecodeCookieValue } from "@/lib/auth/clientStorageHint";
import { ROLE_STORAGE_KEY, parseSoftUxAuthRole } from "@/lib/auth/role";
import { REFRESH_TOKEN_COOKIE_NAME } from "@/lib/auth/token";
import { parseResidenceReviewSearchParams } from "@/lib/utils/residenceReviewSearchParams";

export const generateMetadata = async (): Promise<Metadata> => {
  const t = await getTranslations("residenceReview");
  return { title: t("pageTitle"), description: t("pageDescription") };
};

interface ResidenceReviewsPageProps {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}

const ResidenceReviewsPage = async ({ searchParams }: ResidenceReviewsPageProps) => {
  const filters = parseResidenceReviewSearchParams(await searchParams);
  const cookieStore = await cookies();
  const rawRole = cookieStore.get(ROLE_STORAGE_KEY)?.value;
  const initialRole = parseSoftUxAuthRole(rawRole ? safeDecodeCookieValue(rawRole) : null);
  const initialIsLogin = Boolean(cookieStore.get(REFRESH_TOKEN_COOKIE_NAME));

  return (
    <ResidenceReviewPageView
      filters={filters}
      initialRole={initialRole}
      initialIsLogin={initialIsLogin}
    />
  );
};

export default ResidenceReviewsPage;
