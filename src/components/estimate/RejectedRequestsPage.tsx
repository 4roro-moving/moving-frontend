"use client";

import { useTranslations } from "next-intl";
import { useEffect, useRef } from "react";

import { Text } from "@/components/common/Text";
import MoverEstimateTabs from "@/components/estimate/MoverEstimateTabs";
import { MoverEstimateCardGridSkeleton } from "@/components/estimate/MoverEstimateListSkeleton";
import RejectedRequestCard from "@/components/estimate/RejectedRequestCard";
import EstimatesQueryStatus from "@/components/estimate/EstimatesQueryStatus";
import { useRejectedEstimateRequests } from "@/hooks/useMoverEstimateRequests";

export default function RejectedRequestsPage() {
  const t = useTranslations("estimates");
  const query = useRejectedEstimateRequests();
  const sentinelRef = useRef<HTMLDivElement>(null);
  const items = query.data?.pages.flatMap((page) => page.items) ?? [];
  const { fetchNextPage, hasNextPage, isFetchingNextPage, isFetchNextPageError } = query;

  useEffect(() => {
    const sentinel = sentinelRef.current;
    if (!sentinel) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry?.isIntersecting && hasNextPage && !isFetchingNextPage && !isFetchNextPageError) {
          void fetchNextPage();
        }
      },
      { rootMargin: "240px 0px" },
    );

    observer.observe(sentinel);
    return () => observer.disconnect();
  }, [fetchNextPage, hasNextPage, isFetchingNextPage, isFetchNextPageError]);

  return (
    <>
      <MoverEstimateTabs />
      <main className="bg-background-subtle min-h-[calc(100vh-108px)] px-24 pt-24 pb-40 md:min-h-[calc(100vh-142px)] md:px-72 md:pt-32 xl:min-h-[calc(100vh-168px)] xl:px-0 xl:pt-[59px] xl:pb-[107px]">
        <h1 className="sr-only">{t("tabs.rejected")}</h1>

        {query.isPending ? <MoverEstimateCardGridSkeleton /> : null}

        {query.isError ? (
          <EstimatesQueryStatus
            message={t("mover.rejectedLoadFailed")}
            actionLabel={query.isFetching ? t("retrying") : t("retry")}
            onAction={() => {
              void query.refetch();
            }}
          />
        ) : null}

        {items.length === 0 && !query.isPending && !query.isError ? (
          <EstimatesQueryStatus message={t("mover.rejectedEmpty")} />
        ) : null}

        {items.length > 0 ? (
          <div className="mx-auto w-full max-w-[1200px]">
            <div className="grid grid-cols-1 gap-20 md:mx-auto md:max-w-[600px] md:gap-32 xl:max-w-none xl:grid-cols-2 xl:gap-24">
              {items.map((item) => (
                <RejectedRequestCard key={item.id} item={item} />
              ))}
            </div>

            <div ref={sentinelRef} className="h-1 w-full" aria-hidden="true" />

            {isFetchingNextPage ? (
              <Text variant="lg-regular" className="text-text-muted py-32 text-center">
                {t("mover.rejectedNextLoading")}
              </Text>
            ) : null}

            {isFetchNextPageError ? (
              <fieldset disabled={isFetchingNextPage}>
                <EstimatesQueryStatus
                  message={t("mover.rejectedNextFailed")}
                  actionLabel={isFetchingNextPage ? t("retrying") : t("retry")}
                  onAction={() => {
                    void fetchNextPage();
                  }}
                />
              </fieldset>
            ) : null}
          </div>
        ) : null}
      </main>
    </>
  );
}
