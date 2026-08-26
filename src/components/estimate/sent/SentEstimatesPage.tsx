"use client";

import { useTranslations } from "next-intl";
import { useEffect, useRef } from "react";

import MoverEstimateTabs from "@/components/estimate/MoverEstimateTabs";
import { MoverEstimateCardGridSkeleton } from "@/components/estimate/MoverEstimateListSkeleton";
import EstimatesQueryStatus from "@/components/estimate/EstimatesQueryStatus";
import SentEstimateCard from "@/components/estimate/sent/SentEstimateCard";
import { useSentEstimates } from "@/hooks/useSentEstimates";

export default function SentEstimatesPage() {
  const t = useTranslations("estimates");
  const sentinelRef = useRef<HTMLDivElement>(null);
  const query = useSentEstimates();
  const { fetchNextPage, hasNextPage, isFetchingNextPage, isFetchNextPageError } = query;
  const estimates = query.data?.pages.flatMap((page) => page.data) ?? [];

  useEffect(() => {
    const sentinel = sentinelRef.current;
    if (!sentinel || !hasNextPage || isFetchingNextPage || isFetchNextPageError) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry?.isIntersecting) void fetchNextPage();
      },
      { rootMargin: "240px 0px" },
    );

    observer.observe(sentinel);
    return () => observer.disconnect();
  }, [fetchNextPage, hasNextPage, isFetchingNextPage, isFetchNextPageError]);

  return (
    <>
      <MoverEstimateTabs />
      <main className="bg-background-subtle min-h-[calc(100vh-108px)] px-24 pt-24 pb-[77px] md:min-h-[calc(100vh-142px)] md:px-72 md:pt-32 md:pb-40 xl:min-h-[calc(100vh-168px)] xl:px-0 xl:pt-[59px] xl:pb-[107px]">
        <h1 className="sr-only">{t("tabs.sent")}</h1>

        {query.isPending ? <MoverEstimateCardGridSkeleton /> : null}

        {query.isError ? (
          <EstimatesQueryStatus
            message={t("sent.loadFailed")}
            actionLabel={t("retry")}
            onAction={() => void query.refetch()}
          />
        ) : null}

        {!query.isPending && !query.isError && estimates.length === 0 ? (
          <EstimatesQueryStatus message={t("sent.empty")} />
        ) : null}

        {estimates.length > 0 ? (
          <div className="mx-auto grid w-full min-w-0 grid-cols-1 gap-20 md:max-w-[600px] md:gap-32 xl:max-w-[1200px] xl:grid-cols-2 xl:gap-24">
            {estimates.map((estimate) => (
              <div key={estimate.id} className="w-full min-w-0 md:w-[588px]">
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
                />
              </div>
            ))}
          </div>
        ) : null}

        <div ref={sentinelRef} className="h-1 w-full" aria-hidden="true" />

        {query.isFetchingNextPage ? <EstimatesQueryStatus message={t("sent.nextLoading")} /> : null}

        {isFetchNextPageError ? (
          <EstimatesQueryStatus
            message={t("sent.nextLoadFailed")}
            actionLabel={t("retry")}
            onAction={() => void fetchNextPage()}
          />
        ) : null}
      </main>
    </>
  );
}
