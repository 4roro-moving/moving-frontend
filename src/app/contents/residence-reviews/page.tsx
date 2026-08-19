import type { Metadata } from "next";
import {
  dehydrate,
  HydrationBoundary,
  QueryClient,
  type InfiniteData,
} from "@tanstack/react-query";

import ResidenceReviewPageView from "@/components/residence-review/ResidenceReviewPageView";
import { AUTH_QUERY_GUEST_SCOPE } from "@/lib/constants/queryKeys";
import { RESIDENCE_REVIEW_LIST_STALE_TIME_MS } from "@/lib/constants/residenceReview";
import { getResidenceReviewsInfiniteQueryOptions } from "@/lib/queryOptions/residenceReviews";
import {
  parseResidenceReviewSearchParams,
  toResidenceReviewListQuery,
} from "@/lib/utils/residenceReviewSearchParams";
import type { ResidenceReviewListResult } from "@/types/residenceReview";

export const metadata: Metadata = {
  title: "거주 후기",
  description: "지역별 거주 후기를 확인하고 검색·필터로 찾아보세요.",
};

interface ResidenceReviewsPageProps {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}

const ResidenceReviewsPage = async ({ searchParams }: ResidenceReviewsPageProps) => {
  const filters = parseResidenceReviewSearchParams(await searchParams);
  const listQuery = toResidenceReviewListQuery(filters);
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        staleTime: RESIDENCE_REVIEW_LIST_STALE_TIME_MS,
      },
    },
  });
  const reviewsQueryOptions = getResidenceReviewsInfiniteQueryOptions(
    AUTH_QUERY_GUEST_SCOPE,
    listQuery,
  );
  let initialReviews: ResidenceReviewListResult["data"] = [];

  try {
    await queryClient.prefetchInfiniteQuery({
      ...reviewsQueryOptions,
      pages: 1,
    });

    const prefetched = queryClient.getQueryData<InfiniteData<ResidenceReviewListResult>>(
      reviewsQueryOptions.queryKey,
    );
    initialReviews = prefetched?.pages.flatMap((page) => page.data) ?? [];
  } catch {
    // prefetch 실패해도 페이지는 렌더 — 클라이언트가 재요청
  }

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <ResidenceReviewPageView filters={filters} initialReviews={initialReviews} />
    </HydrationBoundary>
  );
};

export default ResidenceReviewsPage;
