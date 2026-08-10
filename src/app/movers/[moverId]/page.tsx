import type { Metadata } from "next";
import { dehydrate, HydrationBoundary, QueryClient } from "@tanstack/react-query";
import { notFound } from "next/navigation";

import MoverDetailView from "@/components/mover/detail/MoverDetailView";
import { getMoverDetailCached } from "@/lib/api/movers";
import { AUTH_QUERY_GUEST_SCOPE, getMoverDetailQueryKey } from "@/lib/constants/queryKeys";
import {
  buildMoverDetailFallbackMetadata,
  buildMoverDetailMetadata,
  buildMoverNotFoundMetadata,
} from "@/lib/share/og";
import { isMoverDetailId } from "@/lib/utils/isMoverDetailId";
import { mapMoverDetailItemToMoverDetail } from "@/lib/utils/mapMover";
import { ApiError } from "@/types/api";
import type { MoverDetail } from "@/types/moverDetail";

interface MoverDetailPageProps {
  params: Promise<{ moverId: string }>;
}

const MOVER_DETAIL_QUERY_STALE_TIME_MS = 60 * 1000;

function getPrefetchErrorMessage(error: unknown): string {
  if (error instanceof ApiError) {
    const status = error.status ? ` (HTTP ${error.status})` : "";
    const code = error.code ? ` [${error.code}]` : "";
    return `${error.message}${status}${code}`;
  }

  return error instanceof Error ? error.message : "알 수 없는 오류";
}

export async function generateMetadata({ params }: MoverDetailPageProps): Promise<Metadata> {
  const { moverId } = await params;

  if (!isMoverDetailId(moverId)) {
    return buildMoverDetailFallbackMetadata();
  }

  try {
    const mover = await getMoverDetailCached(moverId);
    return buildMoverDetailMetadata(moverId, mover);
  } catch (error) {
    if (error instanceof ApiError && error.status === 404) {
      return buildMoverNotFoundMetadata();
    }

    // API 실패·APP_URL 이슈 등과 무관하게 og:image가 비지 않도록 fallback 메타 사용
    return buildMoverDetailFallbackMetadata(moverId);
  }
}

export default async function MoverDetailPage({ params }: MoverDetailPageProps) {
  const { moverId } = await params;

  if (!isMoverDetailId(moverId)) {
    notFound();
  }

  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        staleTime: MOVER_DETAIL_QUERY_STALE_TIME_MS,
      },
    },
  });
  let initialDetail: MoverDetail | null = null;
  let initialDetailError: string | null = null;
  const detailQueryKey = getMoverDetailQueryKey(AUTH_QUERY_GUEST_SCOPE, moverId);

  await queryClient.prefetchQuery({
    queryKey: detailQueryKey,
    queryFn: async () => {
      const item = await getMoverDetailCached(moverId);
      return mapMoverDetailItemToMoverDetail(item);
    },
  });

  initialDetail = queryClient.getQueryData<MoverDetail>(detailQueryKey) ?? null;

  const detailQueryState = queryClient.getQueryState(detailQueryKey);
  if (detailQueryState?.status === "error") {
    initialDetailError = getPrefetchErrorMessage(detailQueryState.error);
  }

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <MoverDetailView
        key={moverId}
        moverId={moverId}
        initialDetail={initialDetail}
        initialDetailError={initialDetailError}
      />
    </HydrationBoundary>
  );
}
