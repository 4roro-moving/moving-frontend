"use client";

import { Text } from "@/components/common/Text";
import MoveTypeChip, { DesignatedChip } from "@/components/estimate/received/MoveTypeChip";
import { useFavoriteMover } from "@/hooks/useFavoriteMover";
import { ConfirmedCheckIcon, LikeIcon, StarIcon } from "@/icons";
import { cn } from "@/lib/utils/cn";
import { formatRating } from "@/lib/utils/estimateFormat";
import type { EstimateDetail } from "@/types/estimate";

interface EstimateDetailDriverSummaryProps {
  detail: EstimateDetail;
  onFavoriteError?: (message: string) => void;
}

function ConfirmedStatus() {
  return (
    <span className="flex shrink-0 items-center gap-4">
      <ConfirmedCheckIcon className="text-icon-brand size-20 shrink-0" aria-hidden="true" />
      <Text as="span" variant="lg-bold" className="text-text-brand">
        확정견적
      </Text>
    </span>
  );
}

// 2026.07.24 정슬기 - [수정] 상세 찜도 목록과 동일하게 클릭 가능하도록 연결
export default function EstimateDetailDriverSummary({
  detail,
  onFavoriteError,
}: EstimateDetailDriverSummaryProps) {
  const { mover, isConfirmed, isDesignated, estimateRequest } = detail;
  const displayName = mover.nickname || mover.name;
  const intro = mover.shortIntro ?? "고객님의 물품을 안전하게 운송해 드립니다.";
  const favoriteMutation = useFavoriteMover({ onError: onFavoriteError });

  return (
    // 2026.07.25 정슬기 - [수정] Desktop driver-summary: gap 20, badge gap 12, 하단 divider(Figma)
    <section className="flex w-full flex-col gap-16 md:gap-20" aria-label="기사 정보">
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
              견적대기
            </Text>
          )}
        </div>

        <div className="flex w-full items-center justify-between gap-12">
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

          <div className="hidden shrink-0 md:block">
            {isConfirmed ? (
              <ConfirmedStatus />
            ) : (
              <Text as="span" variant="lg-semibold" className="text-text-subtle">
                견적대기
              </Text>
            )}
          </div>
        </div>
      </div>

      <div className="border-border-subtle w-full border-t" aria-hidden="true" />

      <div className="flex w-full flex-col gap-8">
        <div className="flex w-full items-center justify-between gap-8">
          <Text as="p" variant="2lg-semibold" className="text-text-primary min-w-0 wrap-break-word">
            {displayName} 기사님
          </Text>
          <button
            type="button"
            className="focus-visible:ring-border-brand rounded-8 flex min-h-44 min-w-44 shrink-0 items-center justify-center gap-4 px-4 py-2 focus-visible:ring-2 focus-visible:outline-none disabled:opacity-60"
            aria-label={
              mover.isFavorite ? `${displayName} 기사님 찜 해제` : `${displayName} 기사님 찜하기`
            }
            aria-pressed={mover.isFavorite}
            disabled={favoriteMutation.isPending}
            onClick={() =>
              favoriteMutation.mutate({
                moverId: mover.id,
                isFavorite: mover.isFavorite,
              })
            }
          >
            <Text as="span" variant="2lg-medium" className="text-text-muted">
              {mover.favoriteCount}
            </Text>
            <LikeIcon
              isFavorite={mover.isFavorite}
              className={cn("size-24", mover.isFavorite ? "text-text-brand" : "text-icon-default")}
            />
          </button>
        </div>

        <div className="flex flex-wrap items-center gap-x-8 gap-y-4">
          <div className="flex items-center gap-2">
            <StarIcon className="text-rating-fill size-20 shrink-0" aria-hidden="true" />
            <div className="flex items-center gap-2">
              <Text as="span" variant="md-medium" className="text-text-secondary">
                {formatRating(mover.averageRating)}
              </Text>
              <Text as="span" variant="md-medium" className="text-rating-count">
                ({mover.reviewCount})
              </Text>
            </div>
          </div>

          <span className="bg-border-muted h-14 w-px shrink-0" aria-hidden="true" />

          <div className="flex items-center gap-4">
            <Text as="span" variant="md-medium" className="text-text-muted">
              경력
            </Text>
            <Text as="span" variant="md-medium" className="text-text-secondary">
              {mover.career}년
            </Text>
          </div>

          <span className="bg-border-muted h-14 w-px shrink-0" aria-hidden="true" />

          <div className="flex items-center gap-4">
            <Text as="span" variant="md-medium" className="text-text-secondary">
              {mover.confirmedCount}건
            </Text>
            <Text as="span" variant="md-medium" className="text-text-muted">
              확정
            </Text>
          </div>
        </div>
      </div>

      <div className="border-border-subtle w-full border-t" aria-hidden="true" />
    </section>
  );
}
