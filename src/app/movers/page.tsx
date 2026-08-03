import type { Metadata } from "next";
import { dehydrate, HydrationBoundary, QueryClient } from "@tanstack/react-query";

import { MoversPageView } from "@/components/mover/list/MoversPageView";
import { AUTH_QUERY_GUEST_SCOPE } from "@/lib/constants/queryKeys";
import { getMoversInfiniteQueryOptions } from "@/lib/queryOptions/movers";
import { parseMoversSearchParams, toMoversListQuery } from "@/lib/utils/moversSearchParams";

export const metadata: Metadata = {
  title: "기사님 찾기",
  description: "내 이사 조건에 맞는 기사님을 찾고, 평점과 경력, 확정 건수를 비교해 보세요.",
};

interface MoversPageProps {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}

export default async function MoversPage({ searchParams }: MoversPageProps) {
  const filters = parseMoversSearchParams(await searchParams);
  const listQuery = toMoversListQuery(filters);

  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        // 클라이언트 QueryProvider(60s)와 맞춤. dehydrate 직후 바로 stale 되지 않게 함.
        staleTime: 60 * 1000,
      },
    },
  });

  try {
    // infinite query는 await 필수 (미대기 dehydrate 시 클라이언트 hydrate 깨질 수 있음)
    await queryClient.prefetchInfiniteQuery({
      // 서버 prefetch에는 access token이 없으므로 guest 캐시로 분리합니다.
      ...getMoversInfiniteQueryOptions(AUTH_QUERY_GUEST_SCOPE, listQuery),
      pages: 1,
    });
  } catch {
    // prefetch 실패해도 페이지는 렌더 — MoversList가 클라이언트에서 재요청
  }

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <MoversPageView filters={filters} />
    </HydrationBoundary>
  );
}
