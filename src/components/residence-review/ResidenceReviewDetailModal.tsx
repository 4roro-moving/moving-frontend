"use client";

import { useState } from "react";

import Button from "@/components/common/Button/Button";
import Modal, { RESPONSIVE_FORM_MODAL_PANEL_CLASSNAME } from "@/components/common/Modal/Modal";
import ProfileAvatar from "@/components/common/ProfileAvatar/ProfileAvatar";
import { Text } from "@/components/common/Text";
import EstimatesQueryStatus from "@/components/estimate/EstimatesQueryStatus";
import ReportModal from "@/components/report/ReportModal";
import ReportMoreMenu from "@/components/report/ReportMoreMenu";
import ResidenceReviewInfoItem from "@/components/residence-review/ResidenceReviewInfoItem";
import ResidenceReviewRatingText from "@/components/residence-review/ResidenceReviewRatingText";
import { useResidenceReviewDetail } from "@/hooks/residence-review/useResidenceReviewDetail";
import { getApiErrorMessage } from "@/lib/api/getApiErrorMessage";
import { ERROR_CODES } from "@/lib/constants/errorCodes";
import { cn } from "@/lib/utils/cn";
import { formatKoreanDateTime } from "@/lib/utils/date";
import {
  formatResidenceReviewAuthorName,
  formatResidenceReviewRating,
  isResidenceReviewOwner,
} from "@/lib/utils/residenceReviewFormat";
import { useAuthStore } from "@/stores/useAuthStore";
import type { PublicResidenceReview } from "@/types/residenceReview";

interface ResidenceReviewDetailModalProps {
  open: boolean;
  review: PublicResidenceReview | null;
  isAuthenticated: boolean;
  onClose: () => void;
  onEdit: (review: PublicResidenceReview) => void;
  onDelete: (review: PublicResidenceReview) => void;
  onExitComplete?: () => void;
}

const ResidenceReviewDetailModal = ({
  open,
  review,
  isAuthenticated,
  onClose,
  onEdit,
  onDelete,
  onExitComplete,
}: ResidenceReviewDetailModalProps) => {
  const [isReportModalOpen, setIsReportModalOpen] = useState(false);

  const userId = useAuthStore((state) => state.user?.id);

  const { data, isError, error, refetch, isFetching } = useResidenceReviewDetail({
    residenceReviewId: review?.id ?? null,
    placeholderData: review ?? undefined,
    enabled: open && review !== null,
  });

  const currentReview = data ?? review;

  if (!currentReview) {
    return null;
  }

  const isOwner = isAuthenticated && isResidenceReviewOwner(currentReview, userId);

  const showReport = isAuthenticated && !isOwner;

  let writtenDate = "";

  try {
    writtenDate = formatKoreanDateTime(currentReview.createdAt);
  } catch {
    writtenDate = "";
  }

  const handleDetailClose = () => {
    setIsReportModalOpen(false);
    onClose();
  };

  return (
    <>
      <Modal
        open={open}
        onClose={handleDetailClose}
        onExitComplete={onExitComplete}
        presentation="responsive"
        size="lg"
        className={cn(RESPONSIVE_FORM_MODAL_PANEL_CLASSNAME, "gap-24 xl:gap-32")}
      >
        <div className="flex w-full items-start justify-between gap-12">
          <Modal.Title>후기 상세</Modal.Title>

          <Modal.Close onClose={handleDetailClose} />
        </div>

        {isError ? (
          <EstimatesQueryStatus
            className="py-40"
            message={getApiErrorMessage(error, ERROR_CODES.RESIDENCE_REVIEW_NOT_FOUND.message)}
            actionLabel="다시 시도"
            actionBusy={isFetching}
            onAction={() => {
              void refetch();
            }}
          />
        ) : (
          <>
            <div className="flex min-h-0 w-full flex-1 flex-col gap-24 overflow-y-auto">
              <ResidenceReviewRatingText
                rating={currentReview.rating}
                starClassName="size-24 xl:size-32"
                textVariant={{
                  base: "lg-bold",
                  xl: "2xl-bold",
                }}
                textClassName="text-text-primary"
              />

              <div className="flex items-center justify-between gap-16">
                <Text
                  as="p"
                  variant={{
                    base: "lg-semibold",
                    xl: "2lg-semibold",
                  }}
                  className="text-text-primary"
                >
                  {formatResidenceReviewAuthorName(currentReview.author.name)}
                </Text>

                <div className="flex items-center gap-12">
                  <ProfileAvatar
                    imageUrl={currentReview.author.imageUrl}
                    className="rounded-12 size-48 xl:size-64"
                    sizes="64px"
                  />

                  {showReport ? (
                    <ReportMoreMenu
                      ariaLabel="더보기"
                      onReport={() => setIsReportModalOpen(true)}
                    />
                  ) : null}
                </div>
              </div>

              <div className="border-border-subtle border-y py-16">
                <dl className="flex w-full items-start gap-16">
                  <ResidenceReviewInfoItem
                    label="후기 지역"
                    value={currentReview.region.name}
                    labelVariant={{
                      base: "xs-regular",
                      xl: "md-regular",
                    }}
                    valueVariant={{
                      base: "sm-medium",
                      xl: "lg-semibold",
                    }}
                    className="flex-1"
                  />

                  <ResidenceReviewInfoItem
                    label="지역 평점"
                    value={formatResidenceReviewRating(currentReview.region.averageRating)}
                    labelVariant={{
                      base: "xs-regular",
                      xl: "md-regular",
                    }}
                    valueVariant={{
                      base: "sm-medium",
                      xl: "lg-semibold",
                    }}
                    className="flex-1"
                  />

                  <ResidenceReviewInfoItem
                    label="작성일"
                    value={writtenDate}
                    labelVariant={{
                      base: "xs-regular",
                      xl: "md-regular",
                    }}
                    valueVariant={{
                      base: "sm-medium",
                      xl: "lg-semibold",
                    }}
                    className="flex-1"
                  />
                </dl>
              </div>

              <div className="flex flex-col gap-12">
                <Text
                  as="h3"
                  variant={{
                    base: "lg-semibold",
                    xl: "xl-semibold",
                  }}
                  className="text-text-primary"
                >
                  {currentReview.title}
                </Text>

                <Text
                  as="p"
                  variant={{
                    base: "md-medium",
                    xl: "lg-medium",
                  }}
                  className="text-text-secondary whitespace-pre-wrap"
                >
                  {currentReview.content}
                </Text>
              </div>
            </div>

            {isOwner ? (
              <div className="flex w-full gap-8">
                <Button
                  type="button"
                  variant="solid"
                  size="cta"
                  fullWidth
                  onClick={() => onEdit(currentReview)}
                >
                  수정
                </Button>

                <Button
                  type="button"
                  variant="outline"
                  size="cta"
                  fullWidth
                  onClick={() => onDelete(currentReview)}
                >
                  삭제
                </Button>
              </div>
            ) : null}
          </>
        )}
      </Modal>

      <ReportModal
        isOpen={isReportModalOpen}
        onClose={() => setIsReportModalOpen(false)}
        targetType="RESIDENCE_REVIEW"
        targetId={String(currentReview.id)}
        targetName={currentReview.title}
      />
    </>
  );
};

export default ResidenceReviewDetailModal;
