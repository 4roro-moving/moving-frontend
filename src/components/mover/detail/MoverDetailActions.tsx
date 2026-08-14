"use client";

import Link from "next/link";

import Button from "@/components/common/Button/Button";
import { Skeleton } from "@/components/common/Skeleton/Skeleton";
import { Text } from "@/components/common/Text";
import { LikeOutlineButton } from "@/components/mover/detail/LikeOutlineButton";
import { APP_ROUTES } from "@/lib/constants/appRoutes";

interface MoverDetailActionsProps {
  moverId: string;
  moverName: string;
  isFavorite: boolean;
  onToggleFavorite: () => void;
  onRequestEstimate: () => void;
  /** Desktop 사이드바용 / Mobile·Tablet 하단 sticky용 */
  layout: "sidebar" | "sticky";
  requestDisabled?: boolean;
  requestButtonLabel?: string;
}

export default function MoverDetailActions({
  moverId,
  moverName,
  isFavorite,
  onToggleFavorite,
  onRequestEstimate,
  layout,
  requestDisabled = false,
  requestButtonLabel = "지정 견적 요청하기",
}: MoverDetailActionsProps) {
  const calendarHref = `${APP_ROUTES.MOVERS.CALENDAR}?moverId=${encodeURIComponent(moverId)}&moverName=${encodeURIComponent(moverName)}`;

  if (layout === "sticky") {
    return (
      <div className="border-border-subtle bg-background-default px-margin-mobile md:px-margin-tablet fixed inset-x-0 bottom-0 z-20 border-t py-28 xl:hidden">
        <div className="mx-auto flex w-full max-w-[600px] items-center gap-8">
          <LikeOutlineButton
            size="sm"
            moverName={moverName}
            isFavorite={isFavorite}
            onClick={onToggleFavorite}
            className="shrink-0"
          />
          <Button
            type="button"
            variant="solid"
            size="cta"
            fullWidth
            className="min-w-0 flex-1"
            disabled={requestDisabled}
            onClick={onRequestEstimate}
          >
            {requestButtonLabel}
          </Button>
          <Link
            href={calendarHref}
            className="border-border-brand text-text-brand rounded-16 flex h-54 min-w-0 flex-1 items-center justify-center border text-[16px] font-semibold"
          >
            일정 확인
          </Link>
        </div>
      </div>
    );
  }

  return (
    <section className="hidden w-full flex-col gap-16 xl:flex" aria-label="견적 요청">
      <Text as="p" variant="2lg-semibold" className="text-text-secondary">
        {moverName} 기사님에게
        <br /> 지정 견적을 요청해보세요!
      </Text>

      <Button
        type="button"
        variant="solid"
        size="detail"
        fullWidth
        disabled={requestDisabled}
        onClick={onRequestEstimate}
      >
        {requestButtonLabel}
      </Button>

      <Link
        href={calendarHref}
        className="border-border-brand text-text-brand rounded-16 hover:bg-background-brand-muted flex h-54 w-full items-center justify-center border text-[16px] font-semibold transition-colors"
      >
        기사님 일정 확인하기
      </Link>

      <LikeOutlineButton
        size="lg"
        moverName={moverName}
        isFavorite={isFavorite}
        onClick={onToggleFavorite}
      />
    </section>
  );
}

interface MoverDetailActionsSkeletonProps {
  layout: "sidebar" | "sticky";
  moverName?: string;
}

/** 인증 상태 확인 중 실제 CTA와 동일한 공간을 확보하는 로딩 UI */
export function MoverDetailActionsSkeleton({
  layout,
  moverName = "",
}: MoverDetailActionsSkeletonProps) {
  if (layout === "sticky") {
    return (
      <div
        className="border-border-subtle bg-background-default px-margin-mobile md:px-margin-tablet fixed inset-x-0 bottom-0 z-20 border-t py-28 xl:hidden"
        aria-label="견적 요청 정보를 불러오는 중"
        aria-busy="true"
      >
        <div className="mx-auto flex w-full max-w-[600px] items-center gap-8">
          <Skeleton className="rounded-16 size-54 shrink-0" />
          <Skeleton className="rounded-16 h-54 min-w-0 flex-1" />
        </div>
      </div>
    );
  }

  return (
    <section
      className="hidden w-full flex-col gap-16 xl:flex"
      aria-label="견적 요청 정보를 불러오는 중"
      aria-busy="true"
    >
      <Text as="p" variant="2lg-semibold" className="text-text-secondary">
        {moverName} 기사님에게
        <br /> 지정 견적을 요청해보세요!
      </Text>
      <Skeleton className="rounded-16 h-54 w-full" />
      <Skeleton className="rounded-16 h-54 w-full" />
    </section>
  );
}
