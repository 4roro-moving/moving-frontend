import type { Metadata } from "next";
import { dehydrate, HydrationBoundary, QueryClient } from "@tanstack/react-query";
import { notFound } from "next/navigation";

import MoverDetailView from "@/components/mover/detail/MoverDetailView";
import { getMoverDetailCached } from "@/lib/api/movers";
import { AUTH_QUERY_GUEST_SCOPE, getMoverDetailQueryKey } from "@/lib/constants/queryKeys";
import { buildMoverDetailMetadata } from "@/lib/share/metadata";
import { isMoverDetailId } from "@/lib/utils/isMoverDetailId";
import { mapMoverDetailItemToMoverDetail } from "@/lib/utils/mapMover";
import { ApiError } from "@/types/api";

interface MoverDetailPageProps {
  params: Promise<{ moverId: string }>;
}

const MOVER_DETAIL_QUERY_STALE_TIME_MS = 60 * 1000;

export async function generateMetadata({ params }: MoverDetailPageProps): Promise<Metadata> {
  const { moverId } = await params;

  if (!isMoverDetailId(moverId)) {
    return {
      title: "기사님 상세",
      description: "이사 기사님 상세 정보를 확인하세요.",
    };
  }

  try {
    const mover = await getMoverDetailCached(moverId);
    return buildMoverDetailMetadata(moverId, mover);
  } catch (error) {
    if (error instanceof ApiError && error.status === 404) {
      return {
        title: "기사님을 찾을 수 없습니다",
        description: "요청하신 기사님 정보를 찾을 수 없습니다.",
      };
    }

    return {
      title: "기사님 상세",
      description: "이사 기사님 상세 정보를 확인하세요.",
    };
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

  try {
    await queryClient.prefetchQuery({
      queryKey: getMoverDetailQueryKey(AUTH_QUERY_GUEST_SCOPE, moverId),
      queryFn: async () => {
        const item = await getMoverDetailCached(moverId);
        return mapMoverDetailItemToMoverDetail(item);
      },
    });
  } catch {
    // prefetch 실패해도 페이지는 렌더 — MoverDetailView가 클라이언트에서 재요청
  }

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <MoverDetailView key={moverId} moverId={moverId} />
    </HydrationBoundary>
  );
}
