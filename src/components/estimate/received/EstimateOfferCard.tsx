"use client";

import Image from "next/image";
import Link from "next/link";

import { Text } from "@/components/common/Text";
import { useFavoriteMover } from "@/hooks/useFavoriteMover";
import { ConfirmedCheckIcon, LikeIcon, ProfileDefaultIcon, StarIcon } from "@/icons";
import { cn } from "@/lib/utils/cn";
import { formatPrice, formatRating } from "@/lib/utils/estimateFormat";
import type { MoveType, ReceivedEstimateListItem } from "@/types/estimate";

import MoveTypeChip, { DesignatedChip } from "./MoveTypeChip";

interface EstimateOfferCardProps {
  offer: ReceivedEstimateListItem;
  moveType: MoveType;
  className?: string;
  onFavoriteError?: (message: string) => void;
}

function EstimateStatusBadge({ status }: { status: ReceivedEstimateListItem["status"] }) {
  if (status === "CONFIRMED") {
    return (
      <span className="flex shrink-0 items-center gap-4">
        <ConfirmedCheckIcon className="text-icon-brand size-20 shrink-0" aria-hidden="true" />
        <Text as="span" variant="lg-bold" className="text-text-brand">
          확정견적
        </Text>
      </span>
    );
  }

  return (
    <Text as="span" variant="lg-semibold" className="text-text-subtle shrink-0">
      견적대기
    </Text>
  );
}

export default function EstimateOfferCard({
  offer,
  moveType,
  className,
  onFavoriteError,
}: EstimateOfferCardProps) {
  const { mover, status, isDesignated, price } = offer;
  const displayName = mover.nickname || mover.name;
  const intro = mover.shortIntro ?? "고객님의 물품을 안전하게 운송해 드립니다.";
  const favoriteMutation = useFavoriteMover({ onError: onFavoriteError });

  return (
    <article
      // 2026.07.24 정슬기 - [수정] Mobile 카드는 border/shadow 없이 flat, 내부 프로필 박스만 muted border
      className={cn(
        "bg-background-default flex w-full flex-col items-stretch gap-8 border-0 py-20 shadow-none md:px-8",
        className,
      )}
    >
      <div className="flex w-full flex-col gap-16 md:gap-20">
        <div className="flex items-center gap-8">
          <MoveTypeChip moveType={moveType} />
          {isDesignated ? <DesignatedChip /> : null}
        </div>

        <div className="flex w-full flex-col gap-16">
          <div className="flex w-full items-start justify-between gap-12">
            {/* 2026.07.24 정슬기 - [수정] 반응형 타이포를 Text variant로 분리 */}
            <Text
              as="p"
              variant="lg-semibold"
              className="text-text-secondary min-w-0 break-words md:hidden"
            >
              {intro}
            </Text>
            <Text
              as="p"
              variant="2lg-semibold"
              className="text-text-secondary hidden min-w-0 truncate md:block"
            >
              {intro}
            </Text>

            <div className="hidden shrink-0 md:block">
              <EstimateStatusBadge status={status} />
            </div>
          </div>

          {/* 2026.07.24 정슬기 - [수정] 상세 이동과 찜 동작이 충돌하지 않도록 Link와 버튼 영역 분리 */}
          <div className="border-border-muted rounded-12 flex w-full items-end justify-between gap-12 border border-solid py-12 pr-20 pl-12 shadow-none">
            <Link
              href={`/estimates/${offer.id}`}
              className="focus-visible:ring-border-brand rounded-8 flex min-w-0 flex-1 items-end gap-12 focus-visible:ring-2 focus-visible:outline-none"
              aria-label={`${displayName} 기사님 견적 상세 보기`}
            >
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

              <div className="flex min-w-0 flex-1 flex-col gap-4 md:gap-8">
                <Text
                  as="p"
                  variant="md-semibold"
                  className="text-text-primary break-words md:hidden"
                >
                  {displayName} 기사님
                </Text>
                <Text
                  as="p"
                  variant="lg-semibold"
                  className="text-text-primary hidden break-words md:block"
                >
                  {displayName} 기사님
                </Text>

                <div className="flex w-full flex-wrap items-center gap-x-8 gap-y-4">
                  <div className="flex items-center gap-2">
                    <StarIcon className="text-rating-fill size-20 shrink-0" aria-hidden="true" />
                    <div className="flex items-center gap-2">
                      <Text as="span" variant="sm-medium" className="text-text-secondary">
                        {formatRating(mover.averageRating)}
                      </Text>
                      <Text as="span" variant="sm-medium" className="text-text-muted">
                        ({mover.reviewCount})
                      </Text>
                    </div>
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

                  <span
                    className="bg-border-muted hidden h-14 w-px shrink-0 sm:block"
                    aria-hidden="true"
                  />

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
            </Link>

            {/* 2026.07.24 정슬기 - [추가] 찜 버튼을 Link 바깥 독립 버튼으로 연결 */}
            <button
              type="button"
              className="focus-visible:ring-border-brand rounded-8 flex min-h-44 min-w-44 shrink-0 items-center justify-center gap-2 px-4 py-2 focus-visible:ring-2 focus-visible:outline-none disabled:opacity-60"
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
              {/* 2026.07.24 정슬기 - [수정] 찜 상태를 LikeIcon isFavorite로 전달해 채움 표시 */}
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
        </div>

        <div className="flex h-32 w-full items-center justify-between gap-12 md:justify-end">
          <div className="md:hidden">
            <EstimateStatusBadge status={status} />
          </div>
          <div className="flex items-center gap-8 md:gap-12">
            <Text as="span" variant="md-medium" className="text-text-muted shrink-0">
              견적 금액
            </Text>
            <Text as="p" variant="2lg-bold" className="text-text-primary break-words md:hidden">
              {formatPrice(price)}
            </Text>
            <Text
              as="p"
              variant="2xl-bold"
              className="text-text-primary hidden break-words md:block"
            >
              {formatPrice(price)}
            </Text>
          </div>
        </div>
      </div>
    </article>
  );
}
