"use client";

import Button from "@/components/common/Button/Button";
import { useTranslations } from "next-intl";
import { Skeleton } from "@/components/common/Skeleton/Skeleton";
import { Text } from "@/components/common/Text";
import { LikeOutlineButton } from "@/components/mover/detail/LikeOutlineButton";
import { APP_ROUTES } from "@/lib/constants/appRoutes";

interface MoverDetailActionsProps {
  moverId: string;
  moverName: string;
  isFavorite: boolean;
  onToggleFavorite: () => void;
  favoriteDisabled?: boolean;
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
  favoriteDisabled = false,
  onRequestEstimate,
  layout,
  requestDisabled = false,
  requestButtonLabel,
}: MoverDetailActionsProps) {
  const t = useTranslations("profile");
  const resolvedRequestButtonLabel = requestButtonLabel ?? t("moverDetailEstimateRequest");
  const calendarHref = `${APP_ROUTES.MOVERS.CALENDAR}?moverId=${encodeURIComponent(moverId)}&moverName=${encodeURIComponent(moverName)}`;

  if (layout === "sticky") {
    return (
      <div className="border-border-subtle bg-background-default px-margin-mobile md:px-margin-tablet fixed inset-x-0 bottom-0 z-20 border-t py-28 xl:hidden">
        <div className="mx-auto flex w-full max-w-[600px] items-center gap-8">
          <LikeOutlineButton
            size="sm"
            moverName={moverName}
            isFavorite={isFavorite}
            disabled={favoriteDisabled}
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
            {resolvedRequestButtonLabel}
          </Button>
          <Button
            href={calendarHref}
            variant="outline"
            size="cta"
            fullWidth
            className="rounded-16 min-w-0 flex-1 shadow-none"
          >
            {t("moverDetailCalendar")}
          </Button>
        </div>
      </div>
    );
  }

  return (
    <section
      className="hidden w-full flex-col gap-16 xl:flex"
      aria-label={t("moverDetailEstimateRequest")}
    >
      <Text as="p" variant="2lg-semibold" className="text-text-secondary whitespace-pre-line">
        {t("moverDetailRequestPrompt", { name: moverName })}
      </Text>

      <Button
        type="button"
        variant="solid"
        size="detail"
        fullWidth
        disabled={requestDisabled}
        onClick={onRequestEstimate}
      >
        {resolvedRequestButtonLabel}
      </Button>

      <Button href={calendarHref} variant="outline" size="detail" fullWidth>
        {t("moverDetailCalendarCheck")}
      </Button>

      <LikeOutlineButton
        size="lg"
        moverName={moverName}
        isFavorite={isFavorite}
        disabled={favoriteDisabled}
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
  const t = useTranslations("profile");
  if (layout === "sticky") {
    return (
      <div
        className="border-border-subtle bg-background-default px-margin-mobile md:px-margin-tablet fixed inset-x-0 bottom-0 z-20 border-t py-28 xl:hidden"
        aria-label={t("moverDetailEstimateLoading")}
        aria-busy="true"
      >
        <div className="mx-auto flex w-full max-w-[600px] items-center gap-8">
          <Skeleton className="rounded-16 size-54 shrink-0" />
          <Skeleton className="rounded-16 h-54 min-w-0 flex-1" />
          <Skeleton className="rounded-16 h-54 min-w-0 flex-1" />
        </div>
      </div>
    );
  }

  return (
    <section
      className="hidden w-full flex-col gap-16 xl:flex"
      aria-label={t("moverDetailEstimateLoading")}
      aria-busy="true"
    >
      <Text as="p" variant="2lg-semibold" className="text-text-secondary whitespace-pre-line">
        {t("moverDetailRequestPrompt", { name: moverName })}
      </Text>
      <Skeleton className="rounded-16 h-64 w-full" />
      <Skeleton className="rounded-16 h-64 w-full" />
      <Skeleton className="rounded-16 h-64 w-full" />
    </section>
  );
}
