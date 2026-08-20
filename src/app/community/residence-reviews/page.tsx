import type { Metadata } from "next";

import ResidenceReviewPageView from "@/components/residence-review/ResidenceReviewPageView";
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

  return <ResidenceReviewPageView filters={filters} />;
};

export default ResidenceReviewsPage;
