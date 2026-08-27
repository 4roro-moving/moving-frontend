"use client";

import AutoTranslatedText from "@/components/common/AutoTranslatedText";

import Image from "next/image";
import Link from "next/link";
import { useFormatter, useTranslations } from "next-intl";

import { Text } from "@/components/common/Text";
import { MoveTypeChip } from "@/components/common/Chip/MoveTypeChip";
import ReviewStarRating from "@/components/review/ReviewStarRating";
import { ProfileDefaultIcon } from "@/icons";
import { APP_ROUTES } from "@/lib/constants/appRoutes";
import { markInternalDetailNavigationOnClick } from "@/lib/utils/detailNavigation";
import { getReviewMoverDisplayName } from "@/lib/utils/estimateFormat";
import type { MyReviewItem } from "@/types/review";

interface MyReviewCardProps {
  review: MyReviewItem;
}

// 2026.07.27 정슬기 - [추가] 내가 작성한 리뷰 카드
// 2026.07.27 정슬기 - [수정] Mobile 주소 줄바꿈·타이포 / Desktop 작성일 우측 배치
// 2026.07.27 정슬기 - [수정] 카드 클릭 시 기사님 상세 페이지로 이동
// 2026.07.30 정슬기 - [수정] 기사님 표시명 공통 헬퍼 사용
export default function MyReviewCard({ review }: MyReviewCardProps) {
  const t = useTranslations("reviews");
  const format = useFormatter();
  const { mover, estimateRequest, rating, content, createdAt, isHidden, hiddenReason } = review;
  const displayName = getReviewMoverDisplayName(mover);
  const titleId = `my-review-${review.id}-title`;
  const createdDate = new Date(createdAt);
  const createdAtLabel = Number.isNaN(createdDate.getTime())
    ? createdAt
    : format.dateTime(createdDate, { year: "numeric", month: "long", day: "numeric" });

  return (
    <Link
      href={APP_ROUTES.MOVERS.DETAIL(mover.id)}
      onClick={(event) =>
        markInternalDetailNavigationOnClick(event, APP_ROUTES.MOVERS.DETAIL(mover.id))
      }
      aria-labelledby={titleId}
      className="bg-background-surface border-border-subtle shadow-estimate-card rounded-16 md:rounded-20 focus-visible:ring-border-brand flex w-full flex-col gap-12 border-[0.5px] px-16 py-20 focus-visible:ring-2 focus-visible:outline-none md:gap-16 md:px-24 md:py-28 xl:gap-20 xl:px-32 xl:py-32"
    >
      <div className="flex w-full flex-col gap-12 md:gap-16">
        <div className="flex flex-wrap items-center gap-8">
          <MoveTypeChip moveType={estimateRequest.moveType} size="sm" className="md:hidden" />
          <MoveTypeChip
            moveType={estimateRequest.moveType}
            size="md"
            className="hidden py-4 pr-7 pl-5 md:inline-flex"
          />
          {isHidden ? (
            <span className="bg-background-brand-muted text-text-brand rounded-md px-8 py-2 text-xs font-semibold">
              {t("hiddenBadge")}
            </span>
          ) : null}
        </div>

        <div className="flex w-full items-start gap-10 md:items-center md:gap-16">
          <div className="bg-background-avatar rounded-12 relative size-50 shrink-0 overflow-hidden">
            {mover.imageUrl ? (
              <Image
                src={mover.imageUrl}
                alt={t("moverProfileImageAlt", { name: displayName })}
                fill
                sizes="50px"
                className="object-cover"
              />
            ) : (
              <ProfileDefaultIcon className="size-full" />
            )}
          </div>

          <div className="flex min-w-0 flex-1 flex-col gap-4">
            <div className="flex w-full items-start justify-between gap-8">
              <Text
                as="h3"
                id={titleId}
                variant={{ base: "md-semibold", md: "lg-semibold" }}
                className="text-text-primary min-w-0 break-words"
              >
                {displayName}
              </Text>
              <Text
                as="time"
                dateTime={createdAt}
                variant="md-medium"
                className="text-text-muted hidden shrink-0 md:inline"
              >
                {createdAtLabel}
              </Text>
            </div>
            <Text
              as="p"
              variant={{ base: "sm-medium", md: "md-medium" }}
              className="text-text-muted break-words"
            >
              {estimateRequest.fromAddress}
              <span aria-hidden="true"> → </span>
              <span className="sr-only">{t("routeFromToConnector")}</span>
              {estimateRequest.toAddress}
            </Text>
          </div>
        </div>
      </div>

      <ReviewStarRating value={rating} size="sm" label={t("myRatingLabel")} />

      <Text
        as="p"
        variant={{ base: "md-regular", md: "lg-regular" }}
        className={
          isHidden
            ? "text-text-muted break-words whitespace-pre-wrap"
            : "text-text-secondary break-words whitespace-pre-wrap"
        }
      >
        <AutoTranslatedText text={content} />
      </Text>

      {isHidden && hiddenReason ? (
        <div className="bg-background-subtle rounded-12 px-12 py-10">
          <p className="text-text-muted text-xs font-semibold">{t("hiddenReason")}</p>
          <p className="text-text-secondary mt-4 text-sm whitespace-pre-wrap">{hiddenReason}</p>
        </div>
      ) : null}

      <Text
        as="time"
        dateTime={createdAt}
        variant="sm-medium"
        className="text-text-muted self-end md:hidden"
      >
        {createdAtLabel}
      </Text>
    </Link>
  );
}
