"use client";

import { useTranslations } from "next-intl";
import { Text } from "@/components/common/Text";
import { MoveTypeChip } from "@/components/common/Chip/MoveTypeChip";
import DesignatedChip from "@/components/estimate/DesignatedChip";
import { FavoriteButton } from "@/components/mover/FavoriteButton";
import { useFavoriteMover } from "@/hooks/useFavoriteMover";
import { ConfirmedCheckIcon, StarIcon } from "@/icons";
import { formatRating } from "@/lib/utils/estimateFormat";
import type { EstimateDetail } from "@/types/estimate";

interface EstimateDetailDriverSummaryProps {
  detail: EstimateDetail;
  onFavoriteError?: (message: string) => void;
}

function ConfirmedStatus() {
  const t = useTranslations("estimates");
  return (
    <span className="flex shrink-0 items-center gap-4">
      <ConfirmedCheckIcon className="text-icon-brand size-20 shrink-0" />
      <Text as="span" variant="lg-bold" className="text-text-brand">
        {t("detail.confirmedStatus")}
      </Text>
    </span>
  );
}

// 2026.07.24 정슬기 - [수정] 상세 찜도 목록과 동일하게 클릭 가능하도록 연결
export default function EstimateDetailDriverSummary({
  detail,
  onFavoriteError,
}: EstimateDetailDriverSummaryProps) {
  const t = useTranslations("estimates");
  const { mover, isConfirmed, isDesignated, estimateRequest } = detail;
  const displayName = mover.nickname || mover.name;
  const intro = mover.shortIntro?.trim() || null;
  const favoriteMutation = useFavoriteMover({ onError: onFavoriteError });

  return (
    // 2026.07.25 정슬기 - [수정] Desktop driver-summary: gap 20, badge gap 12, 하단 divider(Figma)
    <section
      className="flex w-full flex-col gap-16 md:gap-20"
      aria-label={t("detail.moverInfoAria")}
    >
      <div className="flex w-full flex-col gap-12">
        <div className="flex flex-wrap items-center gap-8 md:gap-12">
          <MoveTypeChip moveType={estimateRequest.moveType} />
          {isDesignated ? <DesignatedChip /> : null}
          {isConfirmed ? (
            <div className="md:hidden">
              <ConfirmedStatus />
            </div>
          ) : (
            <Text as="span" variant="lg-semibold" className="text-text-subtle shrink-0 md:hidden">
              {t("detail.waitingStatus")}
            </Text>
          )}
        </div>

        {/* md+: 소개 왼쪽 + 상태({t("detail.confirmedStatus")}/{t("detail.waitingStatus")}) 오른쪽 — 본문 컬럼 안에서 자연스럽게 정렬 */}
        {/* 2026.08.03 정슬기 - [수정] 확정 안내 문구 제거 후 배지만 유지, 과도한 중앙 강제 정렬 제거 */}
        <div className="flex w-full items-center justify-between gap-12">
          {intro ? (
            <>
              <Text
                as="p"
                variant="2lg-semibold"
                className="text-text-secondary min-w-0 wrap-break-word md:hidden"
              >
                {intro}
              </Text>
              <Text
                as="p"
                variant="2xl-semibold"
                className="text-text-secondary hidden min-w-0 wrap-break-word md:block"
              >
                {intro}
              </Text>
            </>
          ) : null}
          <div className="hidden shrink-0 md:block">
            {isConfirmed ? (
              <ConfirmedStatus />
            ) : (
              <Text as="span" variant="lg-semibold" className="text-text-subtle">
                {t("detail.waitingStatus")}
              </Text>
            )}
          </div>
        </div>
      </div>

      <div className="border-border-subtle w-full border-t" aria-hidden="true" />

      <div className="flex w-full flex-col gap-8">
        <div className="flex w-full items-center justify-between gap-8">
          <Text as="p" variant="2lg-semibold" className="text-text-primary min-w-0 wrap-break-word">
            {t("detail.moverName", { name: displayName })}
          </Text>
          <FavoriteButton
            moverName={displayName}
            isFavorite={mover.isFavorite}
            favoriteCount={mover.favoriteCount}
            showCount
            interactive={favoriteMutation.canToggleFavorite}
            countPosition="before"
            countVariant="2lg-medium"
            className="min-h-44 min-w-44 justify-center gap-4 px-4 py-2"
            onToggle={(nextIsFavorite) => {
              favoriteMutation.mutate({ moverId: mover.id, nextIsFavorite });
            }}
          />
        </div>

        <div className="flex flex-wrap items-center gap-x-8 gap-y-4">
          <div className="flex items-center gap-2">
            <StarIcon className="text-rating-fill size-20 shrink-0" />
            <div className="flex items-center gap-2">
              <Text as="span" variant="md-medium" className="text-text-secondary">
                <span className="sr-only">{t("detail.rating")} </span>
                {formatRating(mover.averageRating)}
                <span className="sr-only">{t("detail.pointsReviews")} </span>
              </Text>
              <Text as="span" variant="md-medium" className="text-rating-count">
                <span aria-hidden="true">({mover.reviewCount})</span>
                <span className="sr-only">
                  {t("detail.reviewCount", { count: mover.reviewCount })}
                </span>
              </Text>
            </div>
          </div>

          <span className="bg-border-muted h-14 w-px shrink-0" aria-hidden="true" />

          <div className="flex items-center gap-4">
            <Text as="span" variant="md-medium" className="text-text-muted">
              {t("detail.career")}
            </Text>
            <Text as="span" variant="md-medium" className="text-text-secondary">
              {t("detail.careerYears", { count: mover.career })}
            </Text>
          </div>

          <span className="bg-border-muted h-14 w-px shrink-0" aria-hidden="true" />

          <div className="flex items-center gap-4">
            <Text as="span" variant="md-medium" className="text-text-secondary">
              {t("detail.confirmedCount", { count: mover.confirmedCount })}
            </Text>
            <Text as="span" variant="md-medium" className="text-text-muted">
              {t("detail.confirmed")}
            </Text>
          </div>
        </div>
      </div>

      <div className="border-border-subtle w-full border-t" aria-hidden="true" />
    </section>
  );
}
