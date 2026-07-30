"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";

import { Text } from "@/components/common/Text";
import MoverEstimateTabs from "@/components/estimate/MoverEstimateTabs";
import SentEstimateCard, {
  type SentEstimateItem,
} from "@/components/estimate/sent/SentEstimateCard";

const PAGE_SIZE = 6;

// API 개발 후에 제거하고 연결하겠습니다.
const SENT_ESTIMATES: SentEstimateItem[] = Array.from({ length: 18 }, (_, index) => {
  const status: SentEstimateItem["status"] =
    index === 0 ? "CONFIRMED" : index === 1 ? "SENT" : "COMPLETED";

  return {
    id: index + 1,
    customerName: "김인서",
    moveType: "SMALL",
    isDesignated: true,
    fromRegion: "서울시 중구",
    toRegion: "경기도 수원시",
    moveDate: "2024-07-01",
    price: 180000,
    status,
  };
});

export default function SentEstimatesPage() {
  const router = useRouter();
  const [visibleCount, setVisibleCount] = useState(PAGE_SIZE);
  const sentinelRef = useRef<HTMLDivElement>(null);
  const visibleEstimates = useMemo(() => SENT_ESTIMATES.slice(0, visibleCount), [visibleCount]);
  const hasNextPage = visibleCount < SENT_ESTIMATES.length;

  useEffect(() => {
    const sentinel = sentinelRef.current;
    if (!sentinel || !hasNextPage) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry?.isIntersecting) return;
        setVisibleCount((count) => Math.min(count + PAGE_SIZE, SENT_ESTIMATES.length));
      },
      { rootMargin: "240px 0px" },
    );

    observer.observe(sentinel);
    return () => observer.disconnect();
  }, [hasNextPage]);

  return (
    <>
      <MoverEstimateTabs />
      <main className="bg-background-subtle min-h-[calc(100vh-108px)] px-24 pt-24 pb-[77px] md:min-h-[calc(100vh-142px)] md:px-72 md:pt-32 md:pb-40 lg:min-h-[calc(100vh-168px)] lg:px-0 lg:pt-[59px] lg:pb-[107px]">
        <h1 className="sr-only">보낸 견적 조회</h1>

        <div className="mx-auto grid w-full grid-cols-1 gap-20 md:max-w-[600px] md:gap-32 lg:max-w-[1200px] lg:grid-cols-2 lg:gap-24">
          {visibleEstimates.map((estimate) => (
            <div key={estimate.id}>
              <SentEstimateCard
                estimate={estimate}
                onViewDetail={(estimateId) => router.push(`/estimate/sent/${estimateId}`)}
              />
            </div>
          ))}
        </div>

        <div ref={sentinelRef} className="h-1 w-full" aria-hidden="true" />

        {hasNextPage ? (
          <Text
            as="p"
            variant="lg-regular"
            className="text-text-muted py-32 text-center"
            role="status"
          >
            다음 견적을 불러오는 중이에요.
          </Text>
        ) : null}
      </main>
    </>
  );
}
