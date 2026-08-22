"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";

import { Text } from "@/components/common/Text";
import ReportModal from "@/components/report/ReportModal";
import ReviewStarRating from "@/components/review/ReviewStarRating";
import { cn } from "@/lib/utils/cn";
import { PREVIOUS_DATA_LOADING_CLASS_NAME } from "@/lib/constants/loading";
import { formatDateOnlyLabel } from "@/lib/utils/estimateFormat";
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
          리뷰 목록을 불러오는 중이에요
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
  const [isMoreMenuOpen, setIsMoreMenuOpen] = useState(false);

  const [isReportModalOpen, setIsReportModalOpen] = useState(false);

  const moreMenuRef = useRef<HTMLDivElement>(null);

  // 작성자가 현재 로그인한 고객이면 본인 리뷰이므로 신고 불가
  const isOwnReview = currentUserId === review.customer.id;

  // 로그인한 CUSTOMER/MOVER이면서 본인 리뷰가 아닐 때만 노출
  const showReport = canReport && !isOwnReview;

  useEffect(() => {
    if (!isMoreMenuOpen) {
      return;
    }

    const handleClickOutside = (event: MouseEvent) => {
      if (moreMenuRef.current && !moreMenuRef.current.contains(event.target as Node)) {
        setIsMoreMenuOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isMoreMenuOpen]);

  const handleReportClick = () => {
    setIsMoreMenuOpen(false);
    setIsReportModalOpen(true);
  };

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
                {formatDateOnlyLabel(review.createdAt)}
              </Text>
            </div>

            <ReviewStarRating value={review.rating} size="sm" label="리뷰 별점" />
          </div>

          {showReport ? (
            <div ref={moreMenuRef} className="relative shrink-0">
              <button
                type="button"
                aria-label="리뷰 메뉴 더보기"
                aria-haspopup="menu"
                aria-expanded={isMoreMenuOpen}
                onClick={() => setIsMoreMenuOpen((current) => !current)}
                className={cn(
                  "text-text-secondary",
                  "flex size-32 items-center justify-center rounded-full",
                  "transition-colors",
                  "hover:bg-background-subtle hover:text-text-primary",
                )}
              >
                <span aria-hidden="true" className="text-[22px] leading-none">
                  ⋮
                </span>
              </button>

              {isMoreMenuOpen ? (
                <div
                  role="menu"
                  className={cn(
                    "border-border-default bg-background-surface",
                    "absolute top-[calc(100%+8px)] right-0 z-30",
                    "rounded-8 min-w-[132px] border p-4",
                    "shadow-md",
                  )}
                >
                  <button
                    type="button"
                    role="menuitem"
                    onClick={handleReportClick}
                    className={cn(
                      "text-text-secondary",
                      "rounded-6 flex w-full items-center gap-8",
                      "px-12 py-10",
                      "text-left transition-colors",
                      "hover:bg-background-subtle hover:text-text-primary",
                    )}
                  >
                    <Image
                      src="/icons/report.svg"
                      alt=""
                      width={18}
                      height={18}
                      aria-hidden="true"
                    />

                    <Text as="span" variant="sm-medium">
                      신고하기
                    </Text>
                  </button>
                </div>
              ) : null}
            </div>
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
          {review.content}
        </Text>
      </article>

      {showReport ? (
        <ReportModal
          isOpen={isReportModalOpen}
          onClose={() => setIsReportModalOpen(false)}
          targetType="REVIEW"
          targetId={String(review.id)}
          targetName={`${review.customer.displayName}님의 리뷰`}
        />
      ) : null}
    </>
  );
}
