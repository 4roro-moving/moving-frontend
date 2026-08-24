import { Skeleton } from "@/components/common/Skeleton/Skeleton";

interface ResidenceReviewCardSkeletonListProps {
  count?: number;
}

const ResidenceReviewCardSkeletonList = ({ count = 5 }: ResidenceReviewCardSkeletonListProps) => {
  return (
    <div>
      <ul className="flex flex-col gap-20" aria-hidden="true">
        {Array.from({ length: count }, (_, index) => (
          <li key={index}>
            <div className="bg-background-default border-border-subtle shadow-estimate-card rounded-16 md:rounded-20 flex flex-col gap-16 border-[0.5px] px-16 py-16 md:gap-20 md:p-24 xl:p-40">
              <div className="flex items-center gap-20">
                <Skeleton className="rounded-12 hidden size-64 md:block md:size-80" />
                <div className="flex flex-1 flex-col gap-8">
                  <Skeleton className="h-26 w-120" />
                  <Skeleton className="h-22 w-160" />
                </div>
                <Skeleton className="rounded-12 size-56 md:hidden" />
              </div>
              <Skeleton className="h-32 w-3/4" />
              <Skeleton className="h-26 w-full" />
            </div>
          </li>
        ))}
      </ul>
      <p className="sr-only" role="status">
        거주 후기 목록을 불러오는 중
      </p>
    </div>
  );
};

export default ResidenceReviewCardSkeletonList;
