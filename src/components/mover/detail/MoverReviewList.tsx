"use client";

import AutoTranslatedText from "@/components/common/AutoTranslatedText";

import { useState } from "react";
import { useLocale, useTranslations } from "next-intl";

import { Text } from "@/components/common/Text";
import ReportModal from "@/components/report/ReportModal";
import ReportMoreMenu from "@/components/report/ReportMoreMenu";
import ReviewStarRating from "@/components/review/ReviewStarRating";
import { cn } from "@/lib/utils/cn";
import { PREVIOUS_DATA_LOADING_CLASS_NAME } from "@/lib/constants/loading";
import { formatLocalizedDateOnlyLabel } from "@/lib/utils/estimateFormat";
import type { MoverReviewItem } from "@/types/review";

interface MoverReviewListProps {
  isFetching: boolean;
  isPreviousDataLoading: boolean;
  reviews: MoverReviewItem[];
  canReport: boolean;
  currentUserId?: string;
}

interface MoverReviewListItemProps {
  review: MoverReviewItem;
  canReport: boolean;
  currentUserId?: string;
}

export default function MoverReviewList({
  isFetching,
  isPreviousDataLoading,
  reviews,
  canReport,
  currentUserId,
}: MoverReviewListProps) {
  const t = useTranslations("profile");
  return (
    <ul
      className={cn(
        "flex w-full flex-col",
        isPreviousDataLoading && PREVIOUS_DATA_LOADING_CLASS_NAME,
      )}
      aria-busy={isFetching}
    >
      {isPreviousDataLoading ? (
        <li className="sr-only" role="status">
          {t("moverDetailReviewListLoading")}
        </li>
      ) : null}
      {reviews.map((review, index) => (
        <li
          key={review.id}
          className={cn(
            "border-border-subtle py-20 md:py-24",
            index < reviews.length - 1 && "border-b",
          )}
        >
          <MoverReviewListItem
            review={review}
            canReport={canReport}
            currentUserId={currentUserId}
          />
        </li>
      ))}
    </ul>
  );
}

function MoverReviewListItem({ review, canReport, currentUserId }: MoverReviewListItemProps) {
  const t = useTranslations("profile");
  const locale = useLocale();
  const [isReportModalOpen, setIsReportModalOpen] = useState(false);

  // 작성자가 현재 로그인한 고객이면 본인 리뷰이므로 신고 불가
  const isOwnReview = currentUserId === review.customer.id;

  // 로그인한 CUSTOMER/MOVER이면서 본인 리뷰가 아닐 때만 노출
  const showReport = canReport && !isOwnReview;

  return (
    <>
      <article className="flex w-full flex-col gap-16 md:gap-24">
        <div className="flex items-start justify-between gap-12">
          <div className="flex flex-col gap-8">
            <div className="flex items-center gap-12">
              <Text
                as="p"
                variant={{
                  base: "md-regular",
                  md: "2lg-regular",
                }}
                className="text-text-secondary"
              >
                {review.customer.displayName}
              </Text>

              <span className="bg-border-subtle h-12 w-px" aria-hidden="true" />

              <Text
                as="time"
                dateTime={review.createdAt}
                variant={{
                  base: "md-regular",
                  md: "2lg-regular",
                }}
                className="text-text-muted"
              >
                {formatLocalizedDateOnlyLabel(review.createdAt, locale)}
              </Text>
            </div>

            <ReviewStarRating value={review.rating} size="sm" label={t("reviewRating")} />
          </div>

          {showReport ? (
            <ReportMoreMenu
              ariaLabel={t("reviewMenuAria")}
              onReport={() => setIsReportModalOpen(true)}
            />
          ) : null}
        </div>

        <Text
          as="p"
          variant={{
            base: "md-regular",
            md: "2lg-regular",
          }}
          className="text-text-primary whitespace-pre-line"
        >
          <AutoTranslatedText text={review.content} />
        </Text>
      </article>

      {showReport ? (
        <ReportModal
          isOpen={isReportModalOpen}
          onClose={() => setIsReportModalOpen(false)}
          targetType="REVIEW"
          targetId={String(review.id)}
          targetName={t("reviewTargetName", { name: review.customer.displayName })}
        />
      ) : null}
    </>
  );
}
