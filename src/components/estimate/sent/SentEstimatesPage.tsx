"use client";

import { useEffect, useRef } from "react";
import { useRouter } from "next/navigation";

import MoverEstimateTabs from "@/components/estimate/MoverEstimateTabs";
import EstimatesQueryStatus from "@/components/estimate/EstimatesQueryStatus";
import SentEstimateCard from "@/components/estimate/sent/SentEstimateCard";
import { useSentEstimates } from "@/hooks/useSentEstimates";
import { APP_ROUTES } from "@/lib/constants/appRoutes";

export default function SentEstimatesPage() {
  const router = useRouter();
  const sentinelRef = useRef<HTMLDivElement>(null);
  const query = useSentEstimates();
  const { fetchNextPage, hasNextPage, isFetchingNextPage } = query;
  const estimates = query.data?.pages.flatMap((page) => page.data) ?? [];

  useEffect(() => {
    const sentinel = sentinelRef.current;
    if (!sentinel || !hasNextPage || isFetchingNextPage) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry?.isIntersecting) void fetchNextPage();
      },
      { rootMargin: "240px 0px" },
    );

    observer.observe(sentinel);
    return () => observer.disconnect();
  }, [fetchNextPage, hasNextPage, isFetchingNextPage]);

  return (
    <>
      <MoverEstimateTabs />
      <main className="bg-background-subtle min-h-[calc(100vh-108px)] px-24 pt-24 pb-[77px] md:min-h-[calc(100vh-142px)] md:px-72 md:pt-32 md:pb-40 lg:min-h-[calc(100vh-168px)] lg:px-0 lg:pt-[59px] lg:pb-[107px]">
        <h1 className="sr-only">보낸 견적 조회</h1>

        {query.isPending ? <EstimatesQueryStatus message="보낸 견적을 불러오는 중이에요." /> : null}

        {query.isError ? (
          <EstimatesQueryStatus
            message="보낸 견적을 불러오지 못했어요."
            actionLabel="다시 시도"
            onAction={() => void query.refetch()}
          />
        ) : null}

        {!query.isPending && !query.isError && estimates.length === 0 ? (
          <EstimatesQueryStatus message="아직 보낸 견적이 없어요." />
        ) : null}

        {estimates.length > 0 ? (
          <div className="mx-auto grid w-full grid-cols-1 gap-20 md:max-w-[600px] md:gap-32 lg:max-w-[1200px] lg:grid-cols-2 lg:gap-24">
            {estimates.map((estimate) => (
              <div key={estimate.id}>
                <SentEstimateCard
                  estimate={{
                    id: estimate.id,
                    customerName: estimate.customer.name,
                    moveType: estimate.estimateRequest.moveType,
                    isDesignated: estimate.isDesignated,
                    fromRegion: estimate.estimateRequest.fromRegion.name,
                    toRegion: estimate.estimateRequest.toRegion.name,
                    moveDate: estimate.estimateRequest.moveDate,
                    price: estimate.price,
                    status: estimate.status,
                  }}
                  onViewDetail={(estimateId) =>
                    router.push(APP_ROUTES.MOVER_ESTIMATES.SENT_DETAIL(estimateId))
                  }
                />
              </div>
            ))}
          </div>
        ) : null}

        <div ref={sentinelRef} className="h-1 w-full" aria-hidden="true" />

        {query.isFetchingNextPage ? (
          <EstimatesQueryStatus message="다음 견적을 불러오는 중이에요." />
        ) : null}
      </main>
    </>
  );
}
