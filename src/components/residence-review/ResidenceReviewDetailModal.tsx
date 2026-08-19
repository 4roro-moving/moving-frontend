"use client";

import Image from "next/image";

import Button from "@/components/common/Button/Button";
import Modal, { RESPONSIVE_FORM_MODAL_PANEL_CLASSNAME } from "@/components/common/Modal/Modal";
import { Text } from "@/components/common/Text";
import EstimatesQueryStatus from "@/components/estimate/EstimatesQueryStatus";
import { useResidenceReviewDetail } from "@/hooks/useResidenceReviewDetail";
import { ProfileDefaultIcon, StarIcon } from "@/icons";
import { getApiErrorMessage } from "@/lib/api/getApiErrorMessage";
import { ERROR_CODES } from "@/lib/constants/errorCodes";
import { cn } from "@/lib/utils/cn";
import { formatKoreanDateTime } from "@/lib/utils/date";
import {
  formatResidenceReviewAuthorName,
  formatResidenceReviewRating,
  getResidenceReviewAuthorImageSrc,
  isResidenceReviewOwner,
} from "@/lib/utils/residenceReviewFormat";
import { useAuthStore } from "@/stores/useAuthStore";
import type { PublicResidenceReview } from "@/types/residenceReview";

interface ResidenceReviewDetailModalProps {
  open: boolean;
  review: PublicResidenceReview | null;
  isAuthenticated: boolean;
  onClose: () => void;
  onDelete: (review: PublicResidenceReview) => void;
  onExitComplete?: () => void;
}

interface InfoItemProps {
  label: string;
  value: string;
}

const InfoItem = ({ label, value }: InfoItemProps) => {
  return (
    <div className="flex min-w-0 flex-1 flex-col items-start gap-4">
      <Text as="dt" variant={{ base: "xs-regular", xl: "md-regular" }} className="text-text-muted">
        {label}
      </Text>
      <Text
        as="dd"
        variant={{ base: "sm-medium", xl: "lg-semibold" }}
        className="text-text-secondary m-0"
      >
        {value}
      </Text>
    </div>
  );
};

const ResidenceReviewDetailModal = ({
  open,
  review,
  isAuthenticated,
  onClose,
  onDelete,
  onExitComplete,
}: ResidenceReviewDetailModalProps) => {
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

  const authorImageSrc = getResidenceReviewAuthorImageSrc(currentReview.author.imageUrl);
  const isOwner = isAuthenticated && isResidenceReviewOwner(currentReview, userId);
  const showReport = isAuthenticated && !isOwner;
  let writtenDate = "";

  try {
    writtenDate = formatKoreanDateTime(currentReview.createdAt);
  } catch {
    writtenDate = "";
  }

  return (
    <Modal
      open={open}
      onClose={onClose}
      onExitComplete={onExitComplete}
      presentation="responsive"
      size="lg"
      className={cn(RESPONSIVE_FORM_MODAL_PANEL_CLASSNAME, "gap-24 xl:gap-32")}
    >
      <div className="flex w-full items-start justify-between gap-12">
        <Modal.Title>후기 상세</Modal.Title>
        <Modal.Close onClose={onClose} />
      </div>

      {isError && !currentReview.title ? (
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
            <div className="flex items-center gap-4">
              <StarIcon
                className="text-rating-fill size-24 shrink-0 xl:size-32"
                aria-hidden="true"
              />
              <Text
                as="p"
                variant={{ base: "lg-bold", xl: "2xl-bold" }}
                className="text-text-primary"
              >
                {formatResidenceReviewRating(currentReview.rating)}
              </Text>
            </div>

            <div className="flex items-center justify-between gap-16">
              <Text
                as="p"
                variant={{ base: "lg-semibold", xl: "2lg-semibold" }}
                className="text-text-primary"
              >
                {formatResidenceReviewAuthorName(currentReview.author.name)}
              </Text>
              <div className="bg-background-avatar relative size-48 shrink-0 overflow-hidden rounded-full xl:size-64">
                {authorImageSrc ? (
                  <Image src={authorImageSrc} alt="" fill sizes="64px" className="object-cover" />
                ) : (
                  <ProfileDefaultIcon className="size-full" aria-hidden="true" />
                )}
              </div>
            </div>

            <div className="border-border-subtle border-y py-16">
              <dl className="flex w-full items-start gap-16">
                <InfoItem label="후기 지역" value={currentReview.region.name} />
                <InfoItem
                  label="지역 평점"
                  value={formatResidenceReviewRating(currentReview.region.averageRating)}
                />
                <InfoItem label="작성일" value={writtenDate} />
              </dl>
            </div>

            <div className="flex flex-col gap-12">
              <Text
                as="h3"
                variant={{ base: "lg-semibold", xl: "xl-semibold" }}
                className="text-text-primary"
              >
                {currentReview.title}
              </Text>
              <Text
                as="p"
                variant={{ base: "md-medium", xl: "lg-medium" }}
                className="text-text-secondary whitespace-pre-wrap"
              >
                {currentReview.content}
              </Text>
            </div>
          </div>

          {isOwner ? (
            <div className="flex w-full gap-8">
              <Button type="button" variant="solid" size="cta" fullWidth>
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

          {showReport ? (
            <Button type="button" variant="outline" size="cta" fullWidth>
              신고하기
            </Button>
          ) : null}
        </>
      )}
    </Modal>
  );
};

export default ResidenceReviewDetailModal;
