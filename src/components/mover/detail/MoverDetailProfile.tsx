"use client";

import type { ReactNode } from "react";

import { DriverBadgeIcon, LikeIcon, StarIcon } from "@/icons";
import { cn } from "@/lib/utils/cn";
import { formatRating } from "@/lib/utils/estimateFormat";
import type { MoverDetail } from "@/types/moverDetail";
import { Text } from "@/components/common/Text";
import { MoverServiceTypeChips } from "@/components/mover/MoverServiceTypeChips";

interface MoverDetailProfileProps {
  detail: MoverDetail;
  onToggleFavorite: () => void;
  showFavoriteAction?: boolean;
}

export default function MoverDetailProfile({
  detail,
  onToggleFavorite,
  showFavoriteAction = true,
}: MoverDetailProfileProps) {
  return (
    <section className="flex w-full flex-col gap-36 md:gap-32" aria-label="기사님 소개">
      <div className="flex w-full flex-col gap-16 md:gap-20">
        <div className="flex w-full flex-col gap-12">
          <MoverServiceTypeChips serviceTypes={detail.serviceTypes} size="md" />

          <Text
            as="h1"
            variant={{ base: "2lg-semibold", md: "2xl-semibold" }}
            className="text-text-secondary wrap-break-word"
          >
            {detail.title}
          </Text>
        </div>

        <div className="flex w-full items-center justify-between gap-8">
          <div className="flex min-w-0 items-center gap-4">
            <DriverBadgeIcon className="text-icon-brand size-20 shrink-0" />
            <Text
              as="p"
              variant={{ base: "lg-semibold", md: "2lg-semibold" }}
              className="text-text-primary"
            >
              {detail.name} 기사님
            </Text>
          </div>

          {showFavoriteAction ? (
            <button
              type="button"
              className="focus-visible:ring-border-brand rounded-8 flex min-h-44 shrink-0 items-center gap-4 px-4 py-2 focus-visible:ring-2 focus-visible:outline-none"
              aria-label={`${detail.name} 기사님 찜, 현재 찜 ${detail.favoriteCount}개`}
              aria-pressed={detail.isFavorite}
              onClick={onToggleFavorite}
            >
              <FavoriteSummary detail={detail} />
            </button>
          ) : (
            <div
              className="flex min-h-44 shrink-0 items-center gap-4 px-4 py-2"
              aria-label={`현재 찜 ${detail.favoriteCount}개`}
            >
              <FavoriteSummary detail={detail} />
            </div>
          )}
        </div>

        <Text
          as="p"
          variant={{ base: "md-regular", md: "lg-regular" }}
          className="text-text-muted whitespace-pre-line"
        >
          {detail.description}
        </Text>
      </div>

      <div
        className={cn(
          "border-border-default bg-background-surface flex w-full items-center justify-between border",
          "rounded-12 px-40 py-22",
          "md:rounded-16 md:px-[100px] md:py-28",
        )}
        aria-label="기사님 실적"
      >
        <StatItem label="진행" value={`${detail.confirmedCount}건`} />
        <StatItem
          label="리뷰"
          value={
            <span className="flex items-center gap-2 md:gap-6">
              <StarIcon
                className="text-rating-fill size-20 shrink-0 md:size-24"
                aria-hidden="true"
              />
              <span className="flex items-center gap-2 md:gap-6">
                <Text
                  as="span"
                  variant={{ base: "lg-semibold", md: "xl-bold" }}
                  className="text-text-primary"
                >
                  {formatRating(detail.rating)}
                </Text>
                <Text
                  as="span"
                  variant={{ base: "md-medium", md: "lg-medium" }}
                  className="text-text-weak"
                >
                  ({detail.reviewCount})
                </Text>
              </span>
            </span>
          }
        />
        <StatItem label="총 경력" value={`${detail.careerYears}년`} />
      </div>
    </section>
  );
}

interface FavoriteSummaryProps {
  detail: MoverDetail;
}

function FavoriteSummary({ detail }: FavoriteSummaryProps) {
  return (
    <>
      <Text
        as="span"
        variant={{ base: "md-semibold", md: "2lg-medium" }}
        className="text-text-muted"
        aria-hidden="true"
      >
        {detail.favoriteCount}
      </Text>
      <LikeIcon
        isFavorite={detail.isFavorite}
        className={cn(
          "size-24",
          detail.isFavorite ? "text-like-active-fill" : "text-like-default-stroke",
        )}
      />
    </>
  );
}

function StatItem({ label, value }: { label: string; value: ReactNode }) {
  return (
    <div className="flex min-w-0 flex-col items-center gap-0 md:gap-4">
      <Text
        as="p"
        variant={{ base: "md-regular", md: "lg-regular" }}
        className="text-text-muted md:text-text-tertiary text-center"
      >
        {label}
      </Text>
      {typeof value === "string" ? (
        <Text
          as="p"
          variant={{ base: "lg-semibold", md: "xl-bold" }}
          className="text-text-primary text-center"
        >
          {value}
        </Text>
      ) : (
        value
      )}
    </div>
  );
}
