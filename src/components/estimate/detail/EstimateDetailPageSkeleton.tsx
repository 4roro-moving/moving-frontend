import { Skeleton } from "@/components/common/Skeleton/Skeleton";
import EstimateDetailLayout, {
  ESTIMATE_DETAIL_LAYOUT_CLASSES,
} from "@/components/estimate/detail/EstimateDetailLayout";
import { APP_ROUTES } from "@/lib/constants/appRoutes";

function DetailSectionSkeleton() {
  return (
    <div className="flex w-full flex-col gap-20 md:gap-28">
      <Skeleton className="h-28 w-32 md:h-32 md:w-40" />
      <div className="flex flex-col gap-16">
        <Skeleton className="h-24 w-full" />
        <Skeleton className="h-24 w-4/5" />
        <Skeleton className="h-24 w-3/5" />
      </div>
    </div>
  );
}

export default function EstimateDetailPageSkeleton() {
  return (
    <div aria-busy="true" aria-label="견적 상세 정보를 불러오는 중입니다.">
      <EstimateDetailLayout
        showProfile={false}
        backFallbackHref={APP_ROUTES.MOVER_ESTIMATES.SENT}
        contentClassName="pt-35 pb-64 md:pt-[46px] md:pb-80 lg:pt-[43px] lg:pb-37-5"
        rowClassName={ESTIMATE_DETAIL_LAYOUT_CLASSES.rowClassName}
        mainClassName="gap-20 md:gap-30 xl:w-210 xl:shrink-0"
        asideClassName={ESTIMATE_DETAIL_LAYOUT_CLASSES.asideClassName}
        main={
          <>
            <div className="flex w-full flex-col gap-20 md:gap-26">
              <div className="flex flex-col gap-20 md:gap-26">
                <div className="flex items-center gap-8">
                  <Skeleton className="h-28 w-72 rounded-full" />
                  <Skeleton className="h-28 w-72 rounded-full" />
                </div>
                <Skeleton className="h-32 w-160" />
                <div className="border-border-subtle w-full border-t" />
              </div>
              <div className="flex items-end justify-between">
                <Skeleton className="h-24 w-72" />
                <Skeleton className="h-36 w-160" />
              </div>
            </div>

            <DetailSectionSkeleton />
            <DetailSectionSkeleton />
          </>
        }
        aside={
          <div className="flex w-full flex-col gap-16">
            <Skeleton className="h-24 w-3/4" />
            <Skeleton className="rounded-16 h-54 w-full" />
          </div>
        }
      />
    </div>
  );
}
