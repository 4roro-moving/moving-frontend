import type { Metadata } from "next";
import { cookies } from "next/headers";

import ResidenceReviewPageView from "@/components/residence-review/ResidenceReviewPageView";
import { safeDecodeCookieValue } from "@/lib/auth/clientStorageHint";
import { ROLE_STORAGE_KEY, parseSoftUxAuthRole } from "@/lib/auth/role";
import { REFRESH_TOKEN_COOKIE_NAME } from "@/lib/auth/token";
import { parseResidenceReviewSearchParams } from "@/lib/utils/residenceReviewSearchParams";

export const metadata: Metadata = {
  title: "거주 후기",
  description: "지역별 거주 후기를 확인하고 검색·필터로 찾아보세요.",
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
