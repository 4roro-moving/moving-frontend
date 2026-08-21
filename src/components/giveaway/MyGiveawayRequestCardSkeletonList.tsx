import { Skeleton } from "@/components/common/Skeleton/Skeleton";

interface MyGiveawayRequestCardSkeletonListProps {
  count?: number;
}

const MyGiveawayRequestCardSkeletonList = ({
  count = 3,
}: MyGiveawayRequestCardSkeletonListProps) => {
  return (
    <div>
      <ul className="flex w-full flex-col gap-20" aria-hidden="true">
        {Array.from({ length: count }, (_, index) => (
          <li key={index}>
            <div className="bg-background-default border-border-subtle shadow-estimate-card rounded-20 flex flex-col gap-16 border-[0.5px] px-20 py-24 md:gap-24 md:p-32 xl:flex-row xl:items-center xl:justify-between xl:px-40">
              <div className="flex min-w-0 flex-1 flex-col gap-12 md:gap-8">
                <div className="flex items-center gap-8 md:gap-20">
                  <Skeleton className="rounded-12 size-64 shrink-0 md:size-80" />
                  <div className="flex min-w-0 flex-1 flex-col gap-8">
                    <Skeleton className="h-26 w-3/4" />
                    <Skeleton className="h-24 w-24" />
                  </div>
                </div>
                <div className="flex gap-20">
                  <Skeleton className="h-48 w-64" />
                  <Skeleton className="h-48 w-120" />
                </div>
                <Skeleton className="hidden h-50 w-full md:block" />
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
        내가 작성한 나눔 신청글을 불러오는 중
      </p>
    </div>
  );
};

export default MyGiveawayRequestCardSkeletonList;
