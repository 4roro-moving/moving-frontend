"use client";

import Image from "next/image";

import Button from "@/components/common/Button/Button";
import { Text } from "@/components/common/Text";
import { MoveTypeChip } from "@/components/common/Chip/MoveTypeChip";
import { ProfileDefaultIcon, StarIcon } from "@/icons";
import {
  formatMoveDateLabelSafe,
  formatPrice,
  formatRating,
  getReviewMoverDisplayName,
} from "@/lib/utils/estimateFormat";
import type { ReviewableEstimateItem } from "@/types/review";

interface WritableReviewCardProps {
  item: ReviewableEstimateItem;
  onWriteClick: (item: ReviewableEstimateItem) => void;
}

// 2026.07.27 정슬기 - [추가] 작성 가능 리뷰 카드
// 2026.07.27 정슬기 - [수정] Mobile 세로 / Tablet 강화 / Desktop 가로 CTA 반응형
// 2026.07.30 정슬기 - [수정] 기사님 표시명 공통 헬퍼 사용
export default function WritableReviewCard({ item, onWriteClick }: WritableReviewCardProps) {
  const { mover, estimateRequest, price } = item;
  const moverLabel = getReviewMoverDisplayName(mover);
  const titleId = `writable-review-${item.estimateId}-title`;
  const careerLabel = mover.career == null ? "-" : `${mover.career}년`;
  const ratingValue = mover.averageRating ?? 0;
  const reviewCount = mover.reviewCount ?? 0;

  return (
    <article
      aria-labelledby={titleId}
      className="bg-background-surface border-border-subtle shadow-estimate-card rounded-16 md:rounded-20 flex w-full flex-col gap-20 border-[0.5px] px-16 py-20 md:gap-28 md:px-24 md:py-28 xl:flex-row xl:items-center xl:justify-between xl:gap-40 xl:px-32 xl:py-32"
    >
      <div className="flex min-w-0 flex-1 flex-col gap-16 md:gap-20">
        <div className="flex flex-wrap items-center gap-8">
          <MoveTypeChip moveType={estimateRequest.moveType} size="sm" className="md:hidden" />
          <MoveTypeChip
            moveType={estimateRequest.moveType}
            size="md"
            className="hidden py-4 pr-7 pl-5 md:inline-flex"
          />
        </div>

        <div className="border-border-muted flex w-full items-center gap-10 border-b pb-16 md:gap-16 md:pb-20">
          <div className="bg-background-avatar rounded-12 relative size-50 shrink-0 overflow-hidden">
            {mover.imageUrl ? (
              <Image
                src={mover.imageUrl}
                alt={`${moverLabel} 프로필`}
                fill
                sizes="50px"
                className="object-cover"
              />
            ) : (
              <ProfileDefaultIcon className="size-full" />
            )}
          </div>

          <div className="flex min-w-0 flex-1 flex-col gap-4">
            <Text
              as="h3"
              id={titleId}
              variant={{ base: "md-semibold", md: "lg-semibold" }}
              className="text-text-primary truncate"
            >
              {moverLabel}
            </Text>
            <div className="flex flex-wrap items-center gap-x-8 gap-y-4">
              <div className="flex items-center gap-2">
                <StarIcon
                  className="text-rating-fill size-16 shrink-0 md:size-20"
                  aria-hidden="true"
                />
                <Text as="span" variant="sm-medium" className="text-text-secondary">
                  <span className="sr-only">평점 </span>
                  {formatRating(ratingValue)}
                  <span className="sr-only">점, 리뷰 </span>
                </Text>
                <Text as="span" variant="sm-medium" className="text-text-muted">
                  <span aria-hidden="true">({reviewCount})</span>
                  <span className="sr-only">{reviewCount}개</span>
                </Text>
              </div>
              <span className="bg-border-muted h-14 w-px shrink-0" aria-hidden="true" />
              <div className="flex items-center gap-4">
                <Text as="span" variant="sm-medium" className="text-text-muted">
                  경력
                </Text>
                <Text as="span" variant="sm-medium" className="text-text-secondary">
                  {careerLabel}
                </Text>
              </div>
            </div>
          </div>
        </div>

        <dl className="flex w-full flex-col gap-8 md:gap-12">
          <div className="flex items-start justify-between gap-12">
            <Text
              as="dt"
              variant={{ base: "sm-medium", md: "md-medium" }}
              className="text-text-muted shrink-0"
            >
              출발
            </Text>
            <Text
              as="dd"
              variant={{ base: "sm-medium", md: "md-medium" }}
              className="text-text-primary min-w-0 text-right break-words"
            >
              {estimateRequest.fromAddress}
            </Text>
          </div>
          <div className="flex items-start justify-between gap-12">
            <Text
              as="dt"
              variant={{ base: "sm-medium", md: "md-medium" }}
              className="text-text-muted shrink-0"
            >
              도착
            </Text>
            <Text
              as="dd"
              variant={{ base: "sm-medium", md: "md-medium" }}
              className="text-text-primary min-w-0 text-right break-words"
            >
              {estimateRequest.toAddress}
            </Text>
          </div>
          <div className="flex items-center justify-between gap-12">
            <Text
              as="dt"
              variant={{ base: "sm-medium", md: "md-medium" }}
              className="text-text-muted shrink-0"
            >
              이사일
            </Text>
            <Text
              as="dd"
              variant={{ base: "sm-medium", md: "md-medium" }}
              className="text-text-primary text-right"
            >
              {formatMoveDateLabelSafe(estimateRequest.moveDate)}
            </Text>
          </div>
        </dl>
      </div>

      <div className="border-border-muted flex w-full flex-col gap-16 border-t pt-16 md:gap-20 xl:w-[240px] xl:shrink-0 xl:items-end xl:border-t-0 xl:pt-0">
        <div className="flex w-full items-end justify-between gap-12 xl:flex-col xl:items-end">
          <Text
            as="span"
            variant={{ base: "sm-medium", md: "md-medium" }}
            className="text-text-muted shrink-0"
          >
            확정 견적 금액
          </Text>
          <Text as="p" variant={{ base: "xl-bold", md: "2xl-bold" }} className="text-text-primary">
            {formatPrice(price)}
          </Text>
        </div>
        <Button
          type="button"
          variant="solid"
          size="cta"
          fullWidth
          onClick={() => onWriteClick(item)}
          aria-label={`${moverLabel} 리뷰 작성하기`}
        >
          리뷰 작성하기
        </Button>
      </div>
    </article>
  );
}
