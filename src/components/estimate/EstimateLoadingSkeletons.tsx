import { Skeleton } from "@/components/common/Skeleton/Skeleton";
import {
  ESTIMATE_LIST_PANEL_PADDING_CLASSNAME,
  ESTIMATE_LIST_PANEL_SURFACE_CLASSNAME,
} from "@/components/estimate/estimateSurfaceStyles";
import { cn } from "@/lib/utils/cn";

function PendingEstimateCardSkeleton() {
  return (
    <div className="bg-background-surface border-border-subtle shadow-estimate-card rounded-20 flex w-full flex-col gap-28 border-[0.5px] px-20 py-24 md:gap-40 md:px-40 md:py-32">
      <div className="flex flex-col gap-8 md:gap-12">
        <div className="flex items-center justify-between gap-12">
          <div className="flex flex-wrap items-center gap-8">
            <Skeleton className="h-28 w-74 rounded-full" />
            <Skeleton className="h-28 w-96 rounded-full" />
          </div>
          <Skeleton className="h-24 w-72" />
        </div>

        <div className="flex flex-col gap-16 md:gap-24">
          <div className="flex flex-col gap-4">
            <Skeleton className="h-28 w-4/5 md:h-32" />
            <Skeleton className="h-28 w-3/5 md:h-32" />
          </div>

          <div className="border-border-muted flex items-center gap-8 border-b pt-12 pb-20">
            <Skeleton className="rounded-12 size-50 shrink-0" />
            <div className="flex min-w-0 flex-1 flex-col gap-8">
              <div className="flex items-center justify-between gap-8">
                <Skeleton className="h-24 w-140" />
                <Skeleton className="h-24 w-44" />
              </div>
              <div className="flex flex-wrap items-center gap-x-8 gap-y-4">
                <Skeleton className="h-20 w-92" />
                <Skeleton className="h-20 w-px" />
                <Skeleton className="h-20 w-72" />
                <Skeleton className="h-20 w-px" />
                <Skeleton className="h-20 w-84" />
              </div>
            </div>
          </div>
        </div>

        <div className="flex h-47 items-end justify-between gap-24 md:h-52">
          <Skeleton className="h-24 w-84" />
          <Skeleton className="h-32 w-160 md:h-36 md:w-176" />
        </div>
      </div>

      <div className="flex flex-col-reverse gap-11 md:flex-row">
        <Skeleton className="rounded-16 h-54 w-full md:h-64 md:flex-1" />
        <Skeleton className="rounded-16 h-54 w-full md:h-64 md:flex-1" />
      </div>
    </div>
  );
}

function ReceivedOfferCardSkeleton() {
  return (
    <div className="flex w-full flex-col gap-16 py-20 md:gap-20 md:px-8">
      <div className="flex items-center gap-8">
        <Skeleton className="h-28 w-74 rounded-full" />
        <Skeleton className="h-24 w-88" />
      </div>

      <div className="flex flex-col gap-16">
        <div className="flex items-start justify-between gap-12">
          <div className="flex min-w-0 flex-1 flex-col gap-4">
            <Skeleton className="h-28 w-4/5 md:h-32" />
            <Skeleton className="h-28 w-3/5 md:h-32" />
          </div>
          <Skeleton className="hidden h-24 w-88 md:block" />
        </div>

        <div className="border-border-muted rounded-12 flex items-end justify-between gap-12 border px-12 py-12 pr-20">
          <div className="flex min-w-0 flex-1 items-end gap-12">
            <Skeleton className="rounded-12 size-50 shrink-0" />
            <div className="flex min-w-0 flex-1 flex-col gap-8">
              <Skeleton className="h-24 w-132" />
              <div className="flex flex-wrap items-center gap-x-8 gap-y-4">
                <Skeleton className="h-20 w-92" />
                <Skeleton className="h-20 w-px" />
                <Skeleton className="h-20 w-72" />
                <Skeleton className="hidden h-20 w-px sm:block" />
                <Skeleton className="h-20 w-84" />
              </div>
            </div>
          </div>
          <Skeleton className="h-24 w-44 shrink-0" />
        </div>
      </div>

      <div className="flex h-32 items-center justify-between gap-12 md:justify-end">
        <Skeleton className="h-24 w-88 md:hidden" />
        <div className="flex items-center gap-8 md:gap-12">
          <Skeleton className="h-24 w-84" />
          <Skeleton className="h-32 w-120 md:h-36 md:w-136" />
        </div>
      </div>
    </div>
  );
}

function ReceivedEstimatePanelSkeleton() {
  return (
    <div
      className={cn(
        ESTIMATE_LIST_PANEL_SURFACE_CLASSNAME,
        ESTIMATE_LIST_PANEL_PADDING_CLASSNAME,
        "flex w-full flex-col items-center",
      )}
    >
      <div className="flex w-full flex-col items-stretch gap-28 md:gap-40 xl:flex-row xl:items-start xl:gap-60">
        <div className="flex w-full flex-col gap-16 md:gap-24 xl:w-260 xl:shrink-0 xl:gap-40">
          <div className="flex items-center justify-between">
            <Skeleton className="h-32 w-104" />
            <Skeleton className="hidden h-24 w-72 md:block" />
          </div>

          <div className="flex flex-col gap-12 md:gap-16">
            <Skeleton className="h-24 w-full" />
            <Skeleton className="h-px w-full md:hidden" />
            <Skeleton className="h-24 w-full" />
            <Skeleton className="h-24 w-full" />
            <Skeleton className="h-px w-full md:hidden" />
            <Skeleton className="h-24 w-3/4" />
          </div>

          <Skeleton className="h-24 w-72 self-end md:hidden" />
        </div>

        <div
          className="bg-border-subtle hidden h-px w-full shrink-0 md:block xl:h-auto xl:w-px xl:self-stretch"
          aria-hidden="true"
        />

        <div className="flex min-w-0 flex-1 flex-col gap-16 md:gap-20">
          <div className="flex items-start gap-8">
            <Skeleton className="h-32 w-md" />
            <Skeleton className="h-32 w-16" />
          </div>
          <Skeleton className="h-48 w-128 md:w-160" />
          <div className="flex flex-col">
            <ReceivedOfferCardSkeleton />
            <ReceivedOfferCardSkeleton />
          </div>
        </div>
      </div>
    </div>
  );
}

export function PendingEstimatesLoadingSkeleton() {
  return (
    <div role="status" className="flex w-full flex-col">
      <span className="sr-only">대기 중인 견적을 불러오는 중</span>
      <div className="bg-background-default shadow-sub-header flex w-full flex-col">
        <div className="px-margin-mobile md:px-margin-tablet xl:px-sub-header-padding-left-desktop xl:pr-sub-header-padding-right-desktop py-24 md:py-28 xl:py-24">
          <div className="max-w-container-pending-mobile md:max-w-container-pending-tablet xl:max-w-container-pending-desktop mx-auto flex w-full flex-col gap-20 md:gap-28 xl:flex-row xl:items-center xl:justify-between xl:gap-20">
            <div className="flex min-w-0 flex-col gap-8 xl:min-w-55 xl:shrink-0">
              <Skeleton className="h-32 w-140" />
              <Skeleton className="h-18 w-120" />
            </div>

            <div className="flex w-full flex-col gap-8 md:hidden">
              <Skeleton className="h-18 w-full" />
              <Skeleton className="h-18 w-full" />
              <Skeleton className="h-18 w-3/4" />
            </div>

            <div className="hidden w-full min-w-0 items-center gap-40 md:flex xl:flex-1 xl:justify-between">
              <Skeleton className="h-24 w-[min(100%,420px)]" />
              <Skeleton className="h-24 w-160 shrink-0" />
            </div>
          </div>
        </div>
      </div>

      <div className="bg-background-subtle px-margin-mobile md:px-margin-tablet flex w-full justify-center pt-35 pb-64 md:pt-42 md:pb-80 xl:px-0 xl:pt-78 xl:pb-80">
        <div className="max-w-container-pending-mobile md:max-w-container-pending-tablet xl:max-w-container-pending-desktop grid w-full grid-cols-1 gap-20 md:gap-32 xl:grid-cols-2 xl:gap-24">
          <PendingEstimateCardSkeleton />
          <div className="hidden xl:block">
            <PendingEstimateCardSkeleton />
          </div>
        </div>
      </div>
    </div>
  );
}

export function ReceivedEstimatesLoadingSkeleton() {
  return (
    <div
      role="status"
      className="px-margin-mobile md:px-margin-tablet max-w-container-desktop-narrow flex w-full flex-col gap-24 md:gap-40 xl:px-0"
    >
      <span className="sr-only">받은 견적을 불러오는 중</span>
      <ReceivedEstimatePanelSkeleton />
      <ReceivedEstimatePanelSkeleton />
    </div>
  );
}
