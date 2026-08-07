import { Skeleton } from "@/components/common/Skeleton/Skeleton";
import EstimateDetailLayout, {
  ESTIMATE_DETAIL_LAYOUT_CLASSES,
} from "@/components/estimate/detail/EstimateDetailLayout";
import { APP_ROUTES } from "@/lib/constants/appRoutes";

interface EstimateRequestListSkeletonProps {
  count?: number;
  showFilter?: boolean;
}

function EstimateRequestCardSkeleton() {
  return (
    <div
      className="bg-background-default md:bg-background-surface md:rounded-20 md:border-border-subtle flex w-full flex-col border-0 px-0 py-0 shadow-none md:border-[0.5px] md:px-28 md:py-32 md:shadow-[-2px_-2px_10px_0_rgba(220,220,220,0.14),2px_2px_10px_0_rgba(220,220,220,0.14)] xl:px-40 xl:pt-48 xl:pb-40"
      aria-hidden="true"
    >
      <div className="flex w-full flex-col gap-16 md:gap-20">
        <div className="flex w-full items-center justify-between gap-8">
          <div className="flex items-center gap-8">
            <Skeleton className="rounded-6 h-32 w-76" />
            <Skeleton className="rounded-6 h-32 w-84" />
          </div>
          <Skeleton className="h-20 w-52" />
        </div>

        <div className="flex min-w-0 flex-col gap-6">
          <Skeleton className="h-26 w-120" />
          <Skeleton className="h-14 w-144" />
        </div>

        <div className="flex w-full flex-col gap-10 md:gap-12">
          {Array.from({ length: 3 }, (_, index) => (
            <div key={index} className="flex w-full items-center justify-between gap-12">
              <Skeleton className="h-18 w-64 shrink-0" />
              <Skeleton className="h-20 w-[55%] max-w-320" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

/**
 * 보낸 견적 요청 목록 로딩 Skeleton.
 * 실제 카드의 외곽/간격을 유지해 최초 로딩과 필터·페이지 전환 시 점프를 줄입니다.
 */
export function EstimateRequestListSkeleton({
  count = 3,
  showFilter = false,
}: EstimateRequestListSkeletonProps) {
  return (
    <div
      className="px-margin-mobile md:px-margin-tablet max-w-container-desktop-narrow mx-auto flex w-full flex-col gap-24 md:gap-40 xl:px-0"
      role="status"
      aria-label="보낸 견적 요청을 불러오는 중"
    >
      {showFilter ? (
        <div className="flex w-full justify-end" aria-hidden="true">
          <Skeleton className="rounded-12 h-54 w-[128px] md:w-[160px]" />
        </div>
      ) : null}

      <ul className="flex w-full flex-col gap-24 md:gap-40">
        {Array.from({ length: count }, (_, index) => (
          <li key={index}>
            <EstimateRequestCardSkeleton />
          </li>
        ))}
      </ul>

      <span className="sr-only">보낸 견적 요청을 불러오는 중입니다.</span>
    </div>
  );
}

function EstimateRequestDetailMainSkeleton() {
  return (
    <div className="flex w-full flex-col gap-28 md:gap-40" aria-hidden="true">
      <section className="flex w-full flex-col gap-16 md:gap-20">
        <div className="flex w-full flex-col gap-12">
          <div className="flex items-center gap-8 md:gap-12">
            <Skeleton className="rounded-6 h-32 w-80" />
            <Skeleton className="rounded-6 h-32 w-92" />
          </div>
          <div className="flex w-full items-start justify-between gap-12">
            <Skeleton className="h-32 w-160" />
            <Skeleton className="hidden h-26 w-72 md:block" />
          </div>
        </div>
        <Skeleton className="h-px w-full rounded-none" />
      </section>

      <div className="flex w-full flex-col gap-20 md:gap-24">
        {Array.from({ length: 5 }, (_, index) => (
          <div key={index} className="flex w-full items-start justify-between gap-20">
            <Skeleton className="h-20 w-72 shrink-0" />
            <Skeleton className="h-20 w-[55%] max-w-360" />
          </div>
        ))}
      </div>

      <Skeleton className="rounded-16 h-64 w-full" />
    </div>
  );
}

/** 보낸 견적 요청 상세 최초 로딩 Skeleton */
export function EstimateRequestDetailSkeleton() {
  return (
    <div role="status" aria-label="견적 요청 상세를 불러오는 중">
      <EstimateDetailLayout
        title="견적 상세"
        showProfile={false}
        backFallbackHref={APP_ROUTES.ESTIMATES.REQUESTS}
        contentClassName={ESTIMATE_DETAIL_LAYOUT_CLASSES.contentClassName}
        rowClassName={ESTIMATE_DETAIL_LAYOUT_CLASSES.rowClassName}
        mainClassName={ESTIMATE_DETAIL_LAYOUT_CLASSES.mainClassName}
        main={<EstimateRequestDetailMainSkeleton />}
      />
      <span className="sr-only">견적 요청 상세를 불러오는 중입니다.</span>
    </div>
  );
}
