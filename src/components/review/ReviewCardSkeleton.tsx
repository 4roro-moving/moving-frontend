import { Skeleton } from "@/components/common/Skeleton/Skeleton";

interface ReviewCardSkeletonProps {
  count?: number;
}

/**
 * 리뷰 목록 공통 로딩 Skeleton
 * 실제 리뷰 카드의 영역을 유지해 로딩 -> 콘텐츠 전환 시 레이아웃 점프를 줄입니다.
 */
export default function ReviewCardSkeleton({ count = 4 }: ReviewCardSkeletonProps) {
  return (
    <ul
      className="flex w-full flex-col gap-16 md:gap-20 xl:gap-24"
      role="status"
      aria-label="리뷰 목록을 불러오는 중"
    >
      {Array.from({ length: count }, (_, index) => (
        <li key={index}>
          <div className="bg-background-surface border-border-subtle shadow-estimate-card rounded-16 md:rounded-20 flex w-full flex-col gap-20 border-[0.5px] px-16 py-20 md:gap-28 md:px-24 md:py-28 xl:flex-row xl:items-center xl:justify-between xl:gap-40 xl:px-32 xl:py-32">
            <div className="flex min-w-0 flex-1 flex-col gap-16 md:gap-20">
              <div className="flex w-full items-start gap-10 md:gap-16">
                <Skeleton className="rounded-12 size-50 shrink-0 md:size-64" />

                <div className="flex min-w-0 flex-1 flex-col gap-8">
                  <Skeleton className="h-20 w-120 max-w-full" />
                  <Skeleton className="h-16 w-200 max-w-full" />
                  <Skeleton className="h-24 w-64" />
                </div>
              </div>

              <div className="grid w-full grid-cols-1 gap-12 md:grid-cols-3 md:gap-16">
                {Array.from({ length: 3 }, (_, fieldIndex) => (
                  <div key={fieldIndex} className="flex min-w-0 flex-col gap-6">
                    <Skeleton className="h-14 w-40" />
                    <Skeleton className="h-18 w-120 max-w-full" />
                  </div>
                ))}
              </div>
            </div>

            <div className="border-border-muted flex w-full flex-col gap-16 border-t pt-16 md:gap-20 xl:w-[240px] xl:shrink-0 xl:border-t-0 xl:pt-0">
              <div className="flex items-end justify-between gap-12 xl:flex-col xl:items-end">
                <Skeleton className="h-16 w-56" />
                <Skeleton className="h-28 w-100" />
              </div>

              <Skeleton className="rounded-12 h-54 w-full" />
            </div>
          </div>
        </li>
      ))}

      <span className="sr-only">리뷰 목록을 불러오는 중입니다.</span>
    </ul>
  );
}
