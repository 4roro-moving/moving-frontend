"use client";

import { useLocale, useTranslations } from "next-intl";
import Link from "next/link";

import Button, { buttonVariants } from "@/components/common/Button/Button";
import ProfileAvatar from "@/components/common/ProfileAvatar/ProfileAvatar";
import { Text } from "@/components/common/Text";
import { MoveTypeChip } from "@/components/common/Chip/MoveTypeChip";
import DesignatedChip from "@/components/estimate/DesignatedChip";
import { FavoriteButton } from "@/components/mover/FavoriteButton";
import { useConfirmEstimate } from "@/hooks/useConfirmEstimate";
import { useFavoriteMover } from "@/hooks/useFavoriteMover";
import { ConfirmedCheckIcon, StarIcon } from "@/icons";
import { APP_ROUTES } from "@/lib/constants/appRoutes";
import { markInternalDetailNavigationOnClick } from "@/lib/utils/detailNavigation";
import { cn } from "@/lib/utils/cn";
import {
  formatPrice,
  formatRating,
  isConfirmedEstimate,
  isPendingEstimate,
} from "@/lib/utils/estimateFormat";
import type { MyPendingEstimateOffer } from "@/types/estimate";
import type { MoveType } from "@/types/move";

interface PendingEstimateCardProps {
  offer: MyPendingEstimateOffer;
  moveType: MoveType;
  onFavoriteError?: (message: string) => void;
  onConfirmError?: (message: string) => void;
  onConfirmSuccess?: () => void;
}

// 2026.07.25 정슬기 - [추가] Figma card/pending-estimate (510:43164 lg / 510:43215 sm)
// 2026.07.26 정슬기 - [수정] 확정 mutation을 훅으로 분리, 찜 invalidate는 훅이 담당
// 2026.07.27 정슬기 - [수정] article 제목·찜 a11y·평점 sr-only·nextIsFavorite 반영
// 2026.07.29 정슬기 - [수정] 확정 훅을 공통 useConfirmEstimate로 교체
export default function PendingEstimateCard({
  offer,
  moveType,
  onFavoriteError,
  onConfirmError,
  onConfirmSuccess,
}: PendingEstimateCardProps) {
  const t = useTranslations("estimates");
  const locale = useLocale();
  const { mover, status, isDesignated, price } = offer;
  const displayName = mover.nickname || mover.name;
  const intro = mover.shortIntro?.trim() || null;
  const moverTitleId = `offer-${offer.id}-mover`;
  const detailHref = APP_ROUTES.ESTIMATES.PENDING_DETAIL(offer.id);
  // 찜: PENDING_LIST / RECEIVED / DETAIL 캐시는 useFavoriteMover가 갱신
  const favoriteMutation = useFavoriteMover({ onError: onFavoriteError });
  // BE mapListEstimate에는 canConfirm 없음 — SENT만 확정 후보 (pending 목록은 SENT-only)
  const canConfirm = isPendingEstimate(status);

  const confirmMutation = useConfirmEstimate(offer.id, {
    onSuccess: onConfirmSuccess,
    onError: onConfirmError,
  });

  const statusLabel = isConfirmedEstimate(status)
    ? t("detail.confirmedStatus")
    : isPendingEstimate(status)
      ? t("detail.waitingStatus")
      : t("detail.expiredStatus");

  return (
    <article
      aria-labelledby={moverTitleId}
      className={cn(
        // Figma: border 0.5 / radius 20 / shadow / sm: gap28 px20 py24 / lg: gap40 px40 py32
        "bg-background-surface border-border-subtle shadow-estimate-card rounded-20 flex w-full flex-col gap-28 border-[0.5px] px-20 py-24",
        "md:gap-40 md:px-40 md:py-32",
      )}
    >
      <div className="flex w-full flex-col gap-8 md:gap-12">
        <div className="flex w-full flex-col gap-16 md:gap-24">
          <div className="flex w-full items-center justify-between gap-8 md:h-34">
            <div className="flex flex-wrap items-center gap-8">
              {/* Figma Chip sm(Mobile) / md(Tablet·Desktop) — 동일 컴포넌트 size만 분기 */}
              <MoveTypeChip moveType={moveType} size="sm" className="md:hidden" />
              <MoveTypeChip
                moveType={moveType}
                size="md"
                className="hidden py-4 pr-7 pl-5 md:inline-flex"
              />
              {isDesignated ? (
                <>
                  <DesignatedChip size="sm" className="md:hidden" />
                  <DesignatedChip size="md" className="hidden py-4 pr-7 pl-5 md:inline-flex" />
                </>
              ) : null}
            </div>
            <Text as="span" variant="lg-semibold" className="text-text-subtle shrink-0">
              {statusLabel}
            </Text>
          </div>

          <div className="flex w-full flex-col gap-4">
            {/* Figma sm: 16 semibold / lg: 18 semibold */}
            {intro ? (
              <>
                <Text
                  as="p"
                  variant="lg-semibold"
                  className="text-text-secondary wrap-break-word md:hidden"
                >
                  {intro}
                </Text>
                <Text
                  as="p"
                  variant="2lg-semibold"
                  className="text-text-secondary hidden wrap-break-word md:block"
                >
                  {intro}
                </Text>
              </>
            ) : null}

            <div className="border-border-muted flex w-full items-center gap-8 border-b pt-12 pb-20">
              <ProfileAvatar
                imageUrl={mover.imageUrl}
                alt={t("received.profileAlt", { name: displayName })}
                sizes="50px"
                className="rounded-12 size-50"
                imageClassName="object-contain"
              />

              <div className="flex min-w-0 flex-1 flex-col gap-4">
                <div className="flex w-full items-center justify-between gap-8">
                  <div className="flex min-w-0 items-center gap-4">
                    {/* Figma: 인증 배지 20×23 — SVGR 기본 aria-hidden 사용 */}
                    <ConfirmedCheckIcon className="text-icon-brand size-20 shrink-0" />
                    <Text
                      as="h3"
                      id={moverTitleId}
                      variant="md-semibold"
                      className="text-text-primary truncate"
                    >
                      {t("detail.moverName", { name: displayName })}
                    </Text>
                  </div>
                  <FavoriteButton
                    moverName={displayName}
                    isFavorite={mover.isFavorite}
                    favoriteCount={mover.favoriteCount}
                    showCount
                    interactive={favoriteMutation.canToggleFavorite}
                    className="gap-2"
                    onToggle={(nextIsFavorite) => {
                      favoriteMutation.mutate({ moverId: mover.id, nextIsFavorite });
                    }}
                  />
                </div>

                <div className="flex w-full flex-wrap items-center gap-x-8 gap-y-4">
                  <div className="flex items-center gap-2">
                    <StarIcon className="text-rating-fill size-20 shrink-0" />
                    <Text as="span" variant="sm-medium" className="text-text-secondary">
                      <span className="sr-only">{t("detail.rating")} </span>
                      {formatRating(mover.averageRating)}
                      <span className="sr-only">{t("detail.pointsReviews")} </span>
                    </Text>
                    <Text as="span" variant="sm-medium" className="text-text-muted">
                      <span aria-hidden="true">({mover.reviewCount})</span>
                      <span className="sr-only">
                        {t("detail.reviewCount", { count: mover.reviewCount })}
                      </span>
                    </Text>
                  </div>
                  <span className="bg-border-muted h-14 w-px shrink-0" aria-hidden="true" />
                  <div className="flex items-center gap-4">
                    <Text as="span" variant="sm-medium" className="text-text-muted">
                      {t("detail.career")}
                    </Text>
                    <Text as="span" variant="sm-medium" className="text-text-secondary">
                      {t("detail.careerYears", { count: mover.career })}
                    </Text>
                  </div>
                  <span className="bg-border-muted h-14 w-px shrink-0" aria-hidden="true" />
                  <div className="flex items-center gap-4">
                    <Text as="span" variant="sm-medium" className="text-text-secondary">
                      {t("detail.confirmedCount", { count: mover.confirmedCount })}
                    </Text>
                    <Text as="span" variant="sm-medium" className="text-text-muted">
                      {t("detail.confirmed")}
                    </Text>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Figma: price row h47(sm) / h52(lg) */}
        <div className="flex h-47 w-full items-end justify-between gap-24 md:h-52">
          <Text as="span" variant="md-medium" className="text-text-muted shrink-0 md:hidden">
            {t("detail.price")}
          </Text>
          <Text as="span" variant="lg-medium" className="text-text-muted hidden shrink-0 md:inline">
            {t("detail.price")}
          </Text>
          <Text as="p" variant="xl-bold" className="text-text-primary md:hidden">
            {formatPrice(price, locale)}
          </Text>
          <Text as="p" variant="2xl-bold" className="text-text-primary hidden md:block">
            {formatPrice(price, locale)}
          </Text>
        </div>
      </div>

      {/* Mobile: 세로·확정 우선 / Tablet·Desktop: 가로 1:1 gap-11 (Figma Button CTA) */}
      {/* 상세: /estimates/pending/[estimateId] */}
      <div className="flex w-full flex-col-reverse gap-11 md:flex-row">
        <Link
          href={detailHref}
          onClick={(event) => markInternalDetailNavigationOnClick(event, detailHref)}
          className={cn(
            buttonVariants({ variant: "outline", size: "cta", fullWidth: true }),
            "focus-visible:ring-border-brand focus-visible:ring-2 focus-visible:outline-none md:flex-1",
          )}
        >
          <Text as="span" variant="lg-semibold">
            {t("detail.viewDetails")}
          </Text>
        </Link>
        <Button
          type="button"
          variant="solid"
          size="cta"
          fullWidth
          disabled={!canConfirm || confirmMutation.isPending}
          aria-busy={confirmMutation.isPending}
          onClick={() => confirmMutation.mutate()}
          className="md:flex-1"
        >
          {confirmMutation.isPending ? t("confirming") : t("confirmEstimate")}
        </Button>
      </div>
    </article>
  );
}
