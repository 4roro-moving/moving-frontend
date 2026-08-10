import type { ReactNode } from "react";

import DetailHeroBanner from "@/components/common/DetailHeroBanner";
import { PageHeader } from "@/components/common/PageHeader";
import { Skeleton } from "@/components/common/Skeleton/Skeleton";
import EstimatesQueryStatus from "@/components/estimate/EstimatesQueryStatus";
import { cn } from "@/lib/utils/cn";

export const ESTIMATE_DETAIL_LAYOUT_CLASSES = {
  contentClassName: "pt-24 pb-64 md:pt-28 md:pb-80 xl:pb-37-5",
  rowClassName: "gap-32 md:gap-40 xl:justify-center",
  mainClassName: "gap-24 md:gap-30 xl:w-210 xl:shrink-0",
  asideClassName: "gap-28 md:gap-40 xl:w-[320px] xl:shrink-0",
} as const;

interface EstimateDetailLayoutProps {
  title?: string;
  heroImageUrl?: string | null;
  heroName?: string;
  showProfile?: boolean;
  backFallbackHref?: string;
  main: ReactNode;
  aside?: ReactNode;
  contentClassName?: string;
  rowClassName?: string;
  mainClassName?: string;
  asideClassName?: string;
  statusBanner?: ReactNode;
  footer?: ReactNode;
}

export default function EstimateDetailLayout({
  title,
  heroImageUrl = null,
  heroName = "",
  showProfile = true,
  backFallbackHref,
  main,
  aside,
  contentClassName,
  rowClassName,
  mainClassName,
  asideClassName,
  statusBanner,
  footer,
}: EstimateDetailLayoutProps) {
  const headerTitle = title ?? "견적 상세";

  return (
    <div className="bg-background-default flex w-full max-w-full flex-col items-start overflow-x-hidden">
      <PageHeader title={headerTitle} backFallbackHref={backFallbackHref} />

      <DetailHeroBanner imageUrl={heroImageUrl} name={heroName} showProfile={showProfile} />

      <div
        className={cn(
          "px-margin-mobile md:px-margin-tablet flex w-full flex-col items-center xl:px-0",
          contentClassName,
        )}
      >
        {statusBanner ? (
          <div className="max-w-container-desktop mb-20 w-full">{statusBanner}</div>
        ) : null}

        <div
          className={cn(
            "max-w-container-desktop flex w-full flex-col items-stretch xl:flex-row xl:items-start xl:justify-center",
            rowClassName,
          )}
        >
          <main className={cn("flex w-full min-w-0 flex-col", mainClassName)}>{main}</main>

          {aside ? (
            <aside className={cn("flex w-full min-w-0 flex-col items-start", asideClassName)}>
              {aside}
            </aside>
          ) : null}
        </div>
      </div>

      {footer}
    </div>
  );
}

interface EstimateDetailQueryStateProps {
  title?: string;
  message: string;
  actionLabel?: string;
  onAction?: () => void;
  actionBusy?: boolean;
  secondaryAction?: ReactNode;
  backFallbackHref?: string;
  className?: string;
}

export function EstimateDetailQueryState({
  title,
  message,
  actionLabel,
  onAction,
  actionBusy,
  secondaryAction,
  backFallbackHref,
  className,
}: EstimateDetailQueryStateProps) {
  const headerTitle = title ?? "견적 상세";

  return (
    <div className="bg-background-default flex w-full max-w-full flex-col items-start overflow-x-hidden">
      <PageHeader title={headerTitle} backFallbackHref={backFallbackHref} />

      <div className="px-margin-mobile md:px-margin-tablet flex w-full flex-col items-center xl:px-0">
        <div className="max-w-container-desktop w-full">
          <EstimatesQueryStatus
            message={message}
            actionLabel={actionLabel}
            onAction={onAction}
            actionBusy={actionBusy}
            className={className}
          />

          {secondaryAction}
        </div>
      </div>
    </div>
  );
}

interface EstimateDetailLoadingStateProps {
  title?: string;
  showProfile?: boolean;
  backFallbackHref?: string;
  contentClassName?: string;
  rowClassName?: string;
  mainClassName?: string;
  asideClassName?: string;
}

export function EstimateDetailLoadingState({
  title,
  showProfile = true,
  backFallbackHref,
  contentClassName,
  rowClassName,
  mainClassName,
  asideClassName,
}: EstimateDetailLoadingStateProps) {
  return (
    <div
      role="status"
      className="bg-background-default flex w-full max-w-full flex-col items-start overflow-x-hidden"
    >
      <span className="sr-only">견적 상세를 불러오는 중</span>

      <PageHeader title={title ?? "견적 상세"} backFallbackHref={backFallbackHref} />

      {showProfile ? (
        <div className="relative h-160 w-full shrink-0 md:h-200 xl:h-64.75">
          <div className="bg-background-brand absolute top-0 left-1/2 h-30.5 w-full max-w-480 -translate-x-1/2 md:h-42.5 xl:h-56.25" />

          <div className="bg-background-avatar rounded-16 md:rounded-12 left-margin-mobile md:left-margin-tablet xl:rounded-20 absolute bottom-0 size-21.5 overflow-hidden md:size-25 xl:top-30.5 xl:bottom-auto xl:left-[max(1rem,calc(50%_-_601px))] xl:h-34.25 xl:w-32.25">
            <Skeleton className="size-full rounded-none" />
          </div>
        </div>
      ) : (
        <DetailHeroBanner showProfile={false} />
      )}

      <div
        className={cn(
          "px-margin-mobile md:px-margin-tablet flex w-full flex-col items-center xl:px-0",
          contentClassName,
        )}
      >
        <div
          className={cn(
            "max-w-container-desktop flex w-full flex-col items-stretch xl:flex-row xl:items-start xl:justify-center",
            rowClassName,
          )}
        >
          <main className={cn("flex w-full min-w-0 flex-col", mainClassName)}>
            <div className="flex w-full flex-col gap-20 md:gap-26">
              <section className="flex w-full flex-col gap-16 md:gap-20" aria-hidden="true">
                <div className="flex flex-wrap items-center gap-8 md:gap-12">
                  <Skeleton className="h-28 w-74 rounded-full" />
                  <Skeleton className="h-28 w-96 rounded-full" />
                  <Skeleton className="h-24 w-88 md:ml-auto" />
                </div>

                <div className="flex flex-col gap-12">
                  <div className="flex items-start justify-between gap-12">
                    <div className="flex min-w-0 flex-1 flex-col gap-4">
                      <Skeleton className="h-32 w-4/5 md:h-36" />
                      <Skeleton className="h-32 w-3/5 md:h-36" />
                    </div>

                    <Skeleton className="hidden h-24 w-96 md:block" />
                  </div>

                  <Skeleton className="h-px w-full rounded-none" />

                  <div className="flex flex-col gap-8">
                    <div className="flex items-center justify-between gap-8">
                      <Skeleton className="h-28 w-160" />
                      <Skeleton className="h-24 w-56" />
                    </div>

                    <div className="flex flex-wrap items-center gap-x-8 gap-y-4">
                      <Skeleton className="h-20 w-92" />
                      <Skeleton className="h-20 w-px rounded-none" />
                      <Skeleton className="h-20 w-72" />
                      <Skeleton className="h-20 w-px rounded-none" />
                      <Skeleton className="h-20 w-84" />
                    </div>
                  </div>
                </div>

                <Skeleton className="h-px w-full rounded-none" />
              </section>

              <div className="bg-background-surface border-border-subtle shadow-estimate-card rounded-20 flex w-full items-center gap-20 border-[0.5px] px-20 py-24 md:px-32 md:py-28">
                <div className="flex flex-col gap-8">
                  <Skeleton className="h-24 w-88" />
                  <Skeleton className="h-36 w-160 md:h-40 md:w-3xl" />
                </div>
              </div>
            </div>

            <div className="flex w-full flex-col gap-20 md:gap-28">
              <section className="flex w-full flex-col gap-20" aria-hidden="true">
                <div className="flex flex-col gap-12">
                  <Skeleton className="h-24 w-md" />

                  <div className="grid grid-cols-1 gap-12 md:grid-cols-2 md:gap-20">
                    <Skeleton className="rounded-16 h-92 w-full" />
                    <Skeleton className="rounded-16 h-92 w-full" />
                  </div>
                </div>

                <Skeleton className="h-px w-full rounded-none" />
              </section>

              <section className="flex w-full flex-col gap-12" aria-hidden="true">
                <Skeleton className="h-24 w-120" />
                <Skeleton className="rounded-20 h-96 w-full" />
              </section>
            </div>
          </main>

          <aside className={cn("flex w-full min-w-0 flex-col items-start", asideClassName)}>
            <div className="flex w-full flex-col gap-12 xl:gap-30" aria-hidden="true">
              <div className="hidden w-full flex-col gap-8 xl:flex">
                <Skeleton className="h-24 w-72" />
                <Skeleton className="h-40 w-160" />
              </div>

              <div className="flex w-full flex-col gap-12">
                <div className="flex w-full flex-row items-center gap-8 md:gap-12">
                  <Skeleton className="rounded-16 size-64 shrink-0" />
                  <Skeleton className="rounded-16 h-64 flex-1" />
                </div>

                <Skeleton className="h-20 w-4/5 self-center" />
              </div>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}
