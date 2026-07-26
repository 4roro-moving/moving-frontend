"use client";

import Image from "next/image";
import Link from "next/link";

import Button, { buttonVariants } from "@/components/common/Button/Button";
import { Text } from "@/components/common/Text";
import MoveTypeChip, { DesignatedChip } from "@/components/estimate/received/MoveTypeChip";
import { useFavoriteMover } from "@/hooks/useFavoriteMover";
import { useConfirmPendingEstimate } from "@/hooks/usePendingEstimateDetail";
import { ConfirmedCheckIcon, LikeIcon, ProfileDefaultIcon, StarIcon } from "@/icons";
import { cn } from "@/lib/utils/cn";
import {
  formatPrice,
  formatRating,
  isConfirmedEstimate,
  isPendingEstimate,
} from "@/lib/utils/estimateFormat";
import type { MoveType, MyPendingEstimateOffer } from "@/types/estimate";

interface PendingEstimateCardProps {
  offer: MyPendingEstimateOffer;
  moveType: MoveType;
  onFavoriteError?: (message: string) => void;
  onConfirmError?: (message: string) => void;
  onConfirmSuccess?: () => void;
}

// 2026.07.25 정슬기 - [추가] Figma card/pending-estimate (510:43164 lg / 510:43215 sm)
// 2026.07.26 정슬기 - [수정] 확정 mutation을 useConfirmPendingEstimate로 분리, 찜 invalidate는 훅이 담당
export default function PendingEstimateCard({
  offer,
  moveType,
  onFavoriteError,
  onConfirmError,
  onConfirmSuccess,
}: PendingEstimateCardProps) {
  const { mover, status, isDesignated, price } = offer;
  const displayName = mover.nickname || mover.name;
  const intro = mover.shortIntro ?? "고객님의 물품을 안전하게 운송해 드립니다.";
  // 찜 성공 시 MY_LIST·PENDING_DETAIL 캐시는 useFavoriteMover가 낙관적 갱신/무효화
  const favoriteMutation = useFavoriteMover({ onError: onFavoriteError });
  const canConfirm = isPendingEstimate(status);

  // mock confirm — 목록·해당 상세 캐시 무효화는 훅 내부에서 처리
  const confirmMutation = useConfirmPendingEstimate(offer.id, {
    onSuccess: onConfirmSuccess,
    onError: onConfirmError,
  });

  const statusLabel = isConfirmedEstimate(status)
    ? "확정견적"
    : isPendingEstimate(status)
      ? "견적대기"
      : "견적만료";

  return (
    <article
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
            <Text
              as="p"
              variant="lg-semibold"
              className="text-text-secondary break-words md:hidden"
            >
              {intro}
            </Text>
            <Text
              as="p"
              variant="2lg-semibold"
              className="text-text-secondary hidden break-words md:block"
            >
              {intro}
            </Text>

            <div className="border-border-muted flex w-full items-center gap-8 border-b pt-12 pb-20">
              <div className="bg-background-avatar rounded-12 relative size-50 shrink-0 overflow-hidden">
                {mover.imageUrl ? (
                  <Image
                    src={mover.imageUrl}
                    alt={`${displayName} 기사님 프로필`}
                    fill
                    sizes="50px"
                    className="object-cover"
                  />
                ) : (
                  <ProfileDefaultIcon className="size-full" aria-hidden="true" />
                )}
              </div>

              <div className="flex min-w-0 flex-1 flex-col gap-4">
                <div className="flex w-full items-center justify-between gap-8">
                  <div className="flex min-w-0 items-center gap-4">
                    {/* Figma: 인증 배지 20×23 */}
                    <ConfirmedCheckIcon
                      className="text-icon-brand size-20 shrink-0"
                      aria-hidden="true"
                    />
                    <Text as="p" variant="md-semibold" className="text-text-primary truncate">
                      {displayName} 기사님
                    </Text>
                  </div>
                  <button
                    type="button"
                    className="focus-visible:ring-border-brand rounded-8 flex shrink-0 items-center gap-2 focus-visible:ring-2 focus-visible:outline-none disabled:opacity-60"
                    aria-label={
                      mover.isFavorite
                        ? `${displayName} 기사님 찜 해제`
                        : `${displayName} 기사님 찜하기`
                    }
                    aria-pressed={mover.isFavorite}
                    disabled={favoriteMutation.isPending}
                    onClick={() => {
                      // useFavoriteMover가 pending 목록/상세 캐시까지 함께 갱신
                      favoriteMutation.mutate({
                        moverId: mover.id,
                        isFavorite: mover.isFavorite,
                      });
                    }}
                  >
                    <LikeIcon
                      isFavorite={mover.isFavorite}
                      className={cn(
                        "size-24",
                        mover.isFavorite ? "text-text-brand" : "text-icon-default",
                      )}
                    />
                    <Text as="span" variant="md-regular" className="text-text-muted">
                      {mover.favoriteCount}
                    </Text>
                  </button>
                </div>

                <div className="flex w-full flex-wrap items-center gap-x-8 gap-y-4">
                  <div className="flex items-center gap-2">
                    <StarIcon className="text-rating-fill size-20 shrink-0" aria-hidden="true" />
                    <Text as="span" variant="sm-medium" className="text-text-secondary">
                      {formatRating(mover.averageRating)}
                    </Text>
                    <Text as="span" variant="sm-medium" className="text-text-muted">
                      ({mover.reviewCount})
                    </Text>
                  </div>
                  <span className="bg-border-muted h-14 w-px shrink-0" aria-hidden="true" />
                  <div className="flex items-center gap-4">
                    <Text as="span" variant="sm-medium" className="text-text-muted">
                      경력
                    </Text>
                    <Text as="span" variant="sm-medium" className="text-text-secondary">
                      {mover.career}년
                    </Text>
                  </div>
                  <span className="bg-border-muted h-14 w-px shrink-0" aria-hidden="true" />
                  <div className="flex items-center gap-4">
                    <Text as="span" variant="sm-medium" className="text-text-secondary">
                      {mover.confirmedCount}건
                    </Text>
                    <Text as="span" variant="sm-medium" className="text-text-muted">
                      확정
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
            견적 금액
          </Text>
          <Text as="span" variant="lg-medium" className="text-text-muted hidden shrink-0 md:inline">
            견적 금액
          </Text>
          <Text as="p" variant="xl-bold" className="text-text-primary md:hidden">
            {formatPrice(price)}
          </Text>
          <Text as="p" variant="2xl-bold" className="text-text-primary hidden md:block">
            {formatPrice(price)}
          </Text>
        </div>
      </div>

      {/* Mobile: 세로·확정 우선 / Tablet·Desktop: 가로 1:1 gap-11 (Figma Button CTA) */}
      {/* 상세: /estimates/pending/[estimateId] */}
      <div className="flex w-full flex-col-reverse gap-11 md:flex-row">
        <Link
          href={`/estimates/pending/${offer.id}`}
          className={cn(
            buttonVariants({ variant: "outline", size: "cta", fullWidth: true }),
            "focus-visible:ring-border-brand focus-visible:ring-2 focus-visible:outline-none md:flex-1",
          )}
        >
          <Text as="span" variant="lg-semibold">
            상세보기
          </Text>
        </Link>
        <Button
          type="button"
          variant="solid"
          size="cta"
          fullWidth
          disabled={!canConfirm || confirmMutation.isPending}
          onClick={() => confirmMutation.mutate()}
          className="md:flex-1"
        >
          {confirmMutation.isPending ? "확정 중..." : "견적 확정하기"}
        </Button>
      </div>
    </article>
  );
}
