import { Skeleton } from "@/components/common/Skeleton/Skeleton";
import { PageHeader } from "@/components/common/PageHeader";
import { Text } from "@/components/common/Text";
import { ESTIMATE_REQUEST_DETAIL_CARD_CLASSNAME } from "@/components/estimate/EstimateRequestSummaryContent";

function ReceivedRequestCardSkeleton() {
  return (
    <div className={ESTIMATE_REQUEST_DETAIL_CARD_CLASSNAME}>
      <div className="flex flex-col gap-16 md:gap-24">
        <div className="flex min-h-32 items-center justify-between gap-12">
          <div className="flex gap-8">
            <Skeleton className="h-32 w-72 rounded-full" />
            <Skeleton className="h-32 w-96 rounded-full" />
          </div>
          <Skeleton className="h-20 w-56" />
        </div>

        <div className="flex flex-col gap-12">
          <Skeleton className="h-28 w-160" />
          <div className="bg-border-subtle h-px" />
        </div>

        <div className="flex flex-col gap-12 xl:flex-row xl:justify-between xl:gap-20">
          <div className="flex items-end gap-12">
            <Skeleton className="h-48 w-72" />
            <Skeleton className="mb-8 h-1 w-20" />
            <Skeleton className="h-48 w-72" />
          </div>
          <Skeleton className="h-48 w-136" />
        </div>
      </div>

      <div className="flex flex-col gap-[11px] sm:grid sm:grid-cols-2">
        <Skeleton className="rounded-16 h-64 w-full" />
        <Skeleton className="rounded-16 h-64 w-full" />
      </div>
    </div>
  );
}

export default function ReceivedRequestsSkeleton() {
  return (
    <div
      className="grid w-full grid-cols-1 gap-24 md:max-w-[588px] xl:max-w-none xl:grid-cols-2"
      aria-label="받은 요청을 불러오는 중입니다."
      aria-busy="true"
    >
      <ReceivedRequestCardSkeleton />
      <ReceivedRequestCardSkeleton />
    </div>
  );
}

export function ReceivedRequestsPageSkeleton() {
  return (
    <div className="bg-background-default text-text-primary min-h-screen">
      <PageHeader title="받은 요청" />

      <main className="mx-auto flex max-w-[1200px] flex-col gap-0 px-24 pb-80 md:px-[72px] xl:gap-40 xl:px-0">
        <section className="flex flex-col gap-24">
          <Skeleton className="rounded-16 mx-10 h-64 w-[calc(100%_-_20px)] xl:mx-0 xl:w-full" />

          <div className="hidden flex-wrap gap-12 xl:flex">
            <Skeleton className="h-32 w-80 rounded-full" />
            <Skeleton className="h-32 w-80 rounded-full" />
            <Skeleton className="h-32 w-80 rounded-full" />
          </div>
        </section>

        <section className="flex flex-col gap-12 xl:gap-24">
          <Text as="p" variant="2lg-semibold" className="text-text-secondary hidden xl:block">
            전체 0건
          </Text>

          <div className="flex min-h-40 items-center justify-between gap-12 px-10 xl:px-0">
            <Text as="p" variant="md-semibold" className="text-text-secondary xl:hidden">
              전체 0건
            </Text>
            <div className="hidden items-center gap-12 xl:flex">
              <Skeleton className="h-24 w-112" />
              <Skeleton className="h-24 w-112" />
            </div>
            <Skeleton className="rounded-8 h-40 w-112" />
          </div>

          <ReceivedRequestsSkeleton />
        </section>
      </main>
    </div>
  );
}
