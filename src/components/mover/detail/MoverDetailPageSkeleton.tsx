import { Skeleton } from "@/components/common/Skeleton/Skeleton";
import { MOVER_REVIEW_PAGE_LIMIT } from "@/lib/api/movers";
import { cn } from "@/lib/utils/cn";

interface MoverDetailReviewsSkeletonProps {
  count?: number;
  className?: string;
}

/** 리뷰 목록 로딩 스켈레톤 */
export function MoverDetailReviewsSkeleton({
  count = MOVER_REVIEW_PAGE_LIMIT,
  className,
}: MoverDetailReviewsSkeletonProps) {
  return (
    <ul
      className={cn("flex w-full flex-col", className)}
      aria-busy="true"
      aria-label="리뷰 목록을 불러오는 중"
    >
      {Array.from({ length: count }, (_, index) => (
        <li
          key={index}
          className={cn("py-20 md:py-24", index < count - 1 && "border-border-subtle border-b")}
        >
          <div className="flex w-full flex-col gap-16 md:gap-24">
            <div className="flex flex-col gap-8">
              <div className="flex items-center gap-12">
                <Skeleton className="h-20 w-80 md:h-24" />
                <span className="bg-border-subtle h-12 w-px" aria-hidden="true" />
                <Skeleton className="h-20 w-100 md:h-24" />
              </div>
              <Skeleton className="h-16 w-120" />
            </div>
            <div className="flex flex-col gap-8">
              <Skeleton className="h-20 w-full md:h-24" />
              <Skeleton className="h-20 w-4/5 md:h-24" />
              <Skeleton className="h-20 w-3/5 md:h-24" />
            </div>
          </div>
        </li>
      ))}
    </ul>
  );
}

/** 기사 상세 페이지 전체 로딩 스켈레톤 */
export default function MoverDetailPageSkeleton() {
  return (
    <div
      className="bg-background-default flex w-full max-w-full flex-col items-start overflow-x-hidden pb-[110px] xl:pb-0"
      aria-busy="true"
      aria-label="기사님 정보를 불러오는 중"
    >
      <div className="relative h-160 w-full shrink-0 md:h-200 xl:h-64.75">
        <div className="bg-background-brand absolute top-0 left-1/2 h-30.5 w-full max-w-480 -translate-x-1/2 md:h-42.5 xl:h-56.25" />
        <div className="bg-background-avatar rounded-16 md:rounded-12 left-margin-mobile md:left-margin-tablet xl:rounded-20 absolute bottom-0 size-21.5 overflow-hidden md:size-25 xl:top-30.5 xl:bottom-auto xl:left-[max(1rem,calc(50%_-_601px))] xl:h-34.25 xl:w-32.25">
          <Skeleton className="size-full rounded-none" />
        </div>
      </div>

      <div className="px-margin-mobile md:px-margin-tablet flex w-full flex-col items-center pt-24 pb-64 md:pt-28 md:pb-80 xl:px-0 xl:pb-[150px]">
        <div className="max-w-container-desktop flex w-full flex-col items-stretch gap-32 md:gap-40 xl:flex-row xl:items-start xl:justify-between">
          <div className="flex w-full min-w-0 flex-col gap-40 md:gap-40 xl:w-[766px]">
            <div className="flex w-full flex-col gap-16 md:gap-24">
              <div className="flex flex-wrap gap-8">
                <Skeleton className="h-28 w-72 rounded-full" />
                <Skeleton className="h-28 w-72 rounded-full" />
              </div>
              <Skeleton className="h-28 w-160 md:h-32" />
              <Skeleton className="h-24 w-120" />
              <div className="flex flex-col gap-8">
                <Skeleton className="h-16 w-full" />
                <Skeleton className="h-16 w-4/5" />
                <Skeleton className="h-16 w-3/5" />
              </div>
              <div className="flex flex-wrap gap-12">
                <Skeleton className="h-20 w-100" />
                <Skeleton className="h-20 w-100" />
                <Skeleton className="h-20 w-100" />
              </div>
            </div>

            <div className="flex w-full flex-col gap-16">
              <Skeleton className="h-28 w-140" />
              <div className="flex flex-wrap gap-8">
                <Skeleton className="h-32 w-80 rounded-full" />
                <Skeleton className="h-32 w-80 rounded-full" />
              </div>
              <Skeleton className="h-28 w-140" />
              <div className="flex flex-wrap gap-8">
                <Skeleton className="h-32 w-72 rounded-full" />
                <Skeleton className="h-32 w-72 rounded-full" />
                <Skeleton className="h-32 w-72 rounded-full" />
              </div>
            </div>

            <div className="border-border-subtle w-full border-t" aria-hidden="true" />

            <div className="flex w-full flex-col gap-24 md:gap-32">
              <Skeleton className="h-28 w-72 md:h-32" />
              <div className="flex items-center gap-16">
                <Skeleton className="h-48 w-80" />
                <div className="flex flex-col gap-8">
                  <Skeleton className="h-20 w-120" />
                  <Skeleton className="h-16 w-100" />
                </div>
              </div>
              <MoverDetailReviewsSkeleton count={3} />
            </div>
          </div>

          <aside className="hidden w-full min-w-0 flex-col items-start gap-40 xl:flex xl:w-[320px] xl:gap-70 xl:pt-40">
            <div className="flex w-full flex-col gap-16">
              <Skeleton className="h-24 w-full" />
              <Skeleton className="h-24 w-4/5" />
              <Skeleton className="rounded-16 h-54 w-full" />
              <Skeleton className="rounded-16 h-54 w-full" />
            </div>
            <div className="flex w-full flex-col gap-16">
              <Skeleton className="h-24 w-3/4" />
              <Skeleton className="rounded-16 h-48 w-full" />
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}
