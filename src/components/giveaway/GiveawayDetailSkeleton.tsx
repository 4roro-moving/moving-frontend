import { PageHeader } from "@/components/common/PageHeader";
import { Skeleton } from "@/components/common/Skeleton/Skeleton";
import { APP_ROUTES } from "@/lib/constants/appRoutes";
import { GIVEAWAY_DETAIL_TITLE } from "@/lib/constants/giveaway";

const DetailDivider = () => {
  return <div className="bg-border-subtle h-px w-full" aria-hidden="true" />;
};

const GiveawayDetailSkeleton = () => {
  return (
    <div className="bg-background-default flex w-full flex-col items-center">
      <PageHeader title={GIVEAWAY_DETAIL_TITLE} backFallbackHref={APP_ROUTES.COMMUNITY.GIVEAWAY} />

      <div
        className="px-margin-mobile md:px-margin-tablet max-w-container-desktop xl:pb-37-5 mx-auto flex w-full flex-col gap-60 pt-35 pb-48 md:pt-44 md:pb-38 xl:px-0 xl:pt-42"
        aria-busy="true"
        aria-label="나눔 글을 불러오는 중"
      >
        <div className="flex w-full flex-col items-center gap-30 md:flex-row md:items-start md:justify-between md:gap-60">
          <div className="w-full md:w-268 md:shrink-0 xl:w-[500px]">
            <Skeleton className="rounded-6 aspect-square w-full" />
          </div>

          <div className="flex w-full flex-col gap-30 md:min-w-0 md:flex-1 xl:w-[600px] xl:shrink-0">
            <div className="flex w-full flex-col gap-26">
              <div className="flex w-full flex-col gap-20">
                <Skeleton className="h-32 w-4/5" />
                <div className="flex items-center gap-8">
                  <Skeleton className="h-22 w-72" />
                  <Skeleton className="h-22 w-32" />
                </div>
              </div>

              <DetailDivider />
              <Skeleton className="min-h-200 w-full" />
              <DetailDivider />
            </div>

            <div className="flex w-full gap-10">
              <Skeleton className="rounded-12 h-54 w-full" />
              <Skeleton className="rounded-12 h-54 w-full" />
            </div>

            <div className="flex items-center gap-12">
              <Skeleton className="rounded-12 size-64 shrink-0" />
              <Skeleton className="h-26 w-120" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GiveawayDetailSkeleton;
