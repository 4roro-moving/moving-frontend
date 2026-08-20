import { Skeleton } from "@/components/common/Skeleton/Skeleton";

interface MyResidenceReviewCardSkeletonListProps {
  count?: number;
}

const MyResidenceReviewCardSkeletonList = ({
  count = 3,
}: MyResidenceReviewCardSkeletonListProps) => {
  return (
    <div>
      <ul className="flex w-full flex-col gap-20" aria-hidden="true">
        {Array.from({ length: count }, (_, index) => (
          <li key={index}>
            <div className="bg-background-default border-border-subtle shadow-estimate-card rounded-20 flex flex-col gap-16 border-[0.5px] px-20 py-24 md:gap-24 md:p-32 xl:flex-row xl:items-center xl:justify-between xl:px-40">
              <div className="flex min-w-0 flex-1 flex-col gap-12 md:gap-24">
                <Skeleton className="h-22 w-48" />
                <Skeleton className="h-26 w-3/4" />
                <Skeleton className="h-24 w-full" />
                <div className="flex gap-20">
                  <Skeleton className="h-48 w-64" />
                  <Skeleton className="h-48 w-64" />
                  <Skeleton className="hidden h-48 w-120 md:block" />
                </div>
              </div>
              <div className="flex w-full flex-col gap-8 md:flex-row xl:w-160 xl:flex-col">
                <Skeleton className="rounded-12 h-54 w-full" />
                <Skeleton className="rounded-12 h-54 w-full" />
              </div>
            </div>
          </li>
        ))}
      </ul>
      <p className="sr-only" role="status">
        내가 작성한 거주 후기를 불러오는 중
      </p>
    </div>
  );
};

export default MyResidenceReviewCardSkeletonList;
