import { Skeleton } from "@/components/common/Skeleton/Skeleton";
import MoverEstimateTabs from "@/components/estimate/MoverEstimateTabs";

function EstimateCardSkeleton() {
  return (
    <div className="border-border-subtle bg-background-default shadow-estimate-card rounded-20 flex min-h-[333px] w-full flex-col gap-24 border-[0.5px] px-20 py-24 md:min-h-[322px] md:gap-32 md:px-40 md:py-32 xl:min-h-[324px]">
      <div className="flex flex-1 flex-col gap-16 md:gap-24">
        <div className="flex min-h-32 items-center justify-between gap-12">
          <div className="flex gap-8">
            <Skeleton className="h-32 w-72 rounded-full" />
            <Skeleton className="h-32 w-96 rounded-full" />
          </div>
          <Skeleton className="h-24 w-72" />
        </div>

        <div className="flex flex-col gap-12">
          <Skeleton className="h-28 w-160" />
          <div className="bg-border-subtle h-px" />
        </div>

        <div className="flex flex-col gap-12 md:flex-row md:justify-between md:gap-20">
          <div className="flex items-end gap-12">
            <Skeleton className="h-48 w-72" />
            <Skeleton className="mb-8 h-1 w-20" />
            <Skeleton className="h-48 w-72" />
          </div>
          <Skeleton className="h-48 w-136" />
        </div>
      </div>

      <div className="border-border-default flex h-47 items-end justify-between border-t md:h-52">
        <Skeleton className="h-20 w-72" />
        <Skeleton className="h-32 w-120" />
      </div>
    </div>
  );
}

export function MoverEstimateCardGridSkeleton() {
  return (
    <div
      className="mx-auto grid w-full min-w-0 grid-cols-1 gap-20 md:max-w-[600px] md:gap-32 xl:max-w-[1200px] xl:grid-cols-2 xl:gap-24"
      aria-label="견적 목록을 불러오는 중입니다."
      aria-busy="true"
    >
      <EstimateCardSkeleton />
      <EstimateCardSkeleton />
    </div>
  );
}

export default function MoverEstimateListPageSkeleton() {
  return (
    <>
      <MoverEstimateTabs />
      <main className="bg-background-subtle min-h-[calc(100vh-108px)] px-24 pt-24 pb-40 md:min-h-[calc(100vh-142px)] md:px-72 md:pt-32 xl:min-h-[calc(100vh-168px)] xl:px-0 xl:pt-[59px] xl:pb-[107px]">
        <MoverEstimateCardGridSkeleton />
      </main>
    </>
  );
}
